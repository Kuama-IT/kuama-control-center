"use server";
import { platformCredentialsServer } from "@/modules/platform-credentials/platform-credentials.server";
import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { handleServerErrors, isFailure } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { spentTimes, tasks } from "@/drizzle/schema";
import { format } from "date-fns";
import { firstOrThrow } from "@/utils/array-utils";

const action = async (
    credentialId: number,
    range: { from: Date; to: Date },
) => {
    // TODO complete (we're missing jira)
    const credentials = await platformCredentialsServer.byId(credentialId);

    if (isFailure(credentials)) {
        throw new Error(JSON.parse(credentials.message));
    }

    const projectId = credentials.project?.id;
    const employeeId = credentials.employee?.id;

    if (!projectId || !employeeId) {
        throw new Error(
            `Project ID or Employee ID not found for credential ${credentialId}`,
        );
    }

    // based on credentials provider, instantiate correct client and sync data
    if (credentials.platform === "easyredmine") {
        const client = new EasyRedmineApiClient(
            credentials.endpoint,
            credentials.persistentToken,
        );

        const spentTimesResult = await client.getSpentTimes(range);
        await db.transaction(async (tx) => {
            for (const spentTime of spentTimesResult.timesSpent) {
                const taskPayload: typeof tasks.$inferInsert = {
                    name: spentTime.task.subject,
                    description: spentTime.task.subject,
                    externalTrackerId: spentTime.task.id,
                    platform: credentials.platform,
                    projectId,
                    employeeId,
                    creationDate: format(
                        new Date(spentTime.task.date),
                        "yyyy-MM-dd",
                    ),
                };

                const res = await tx
                    .insert(tasks)
                    .values(taskPayload)
                    .onConflictDoUpdate({
                        target: tasks.externalTrackerId,
                        set: taskPayload,
                    })
                    .returning({ taskId: tasks.id });

                if (res.length != 1) {
                    throw new Error(
                        `Could not upsert task ${spentTime.task.id}`,
                    );
                }

                const { taskId } = firstOrThrow(res);

                console.log(
                    `spending time for task ${spentTime.task.subject}: ${spentTime.spentTime}`,
                );
                const spentTimePayload: typeof spentTimes.$inferInsert = {
                    duration: `${spentTime.spentTime} hour`,
                    date: format(new Date(spentTime.date), "yyyy-MM-dd"),
                    taskId: taskId,
                    externalTrackerId: spentTime.task.id,
                    platform: credentials.platform,
                };

                await tx
                    .insert(spentTimes)
                    .values(spentTimePayload)
                    .onConflictDoUpdate({
                        target: spentTimes.externalTrackerId,
                        set: spentTimePayload,
                    });
            }
        });
    }

    await new Promise((resolve) => setTimeout(resolve, 6000));
    console.log("done internal action");
};

const handled = handleServerErrors(
    async (credentialId: number, range: { from: Date; to: Date }) => {
        // do not make user to wait until import is done
        void action(credentialId, range);
        console.log("request completed");
    },
);

export default handled;
