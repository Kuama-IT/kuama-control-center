"use server";
import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { handleServerErrors, isFailure } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kSpentTimes, kTasks } from "@/drizzle/schema";
import { format } from "date-fns";
import { firstOrThrow } from "@/utils/array-utils";

const action = async (
  credentialId: number,
  range: { from: Date; to: Date },
) => {
  // TODO complete (we're missing jira)
  const credentials = await kPlatformCredentialsServer.byId(credentialId);

  if (isFailure(credentials)) {
    throw new Error(JSON.parse(credentials.message));
  }

  const projectId = credentials.kProject?.id;
  const employeeId = credentials.kEmployee?.id;

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

    const spentTimes = await client.getSpentTimes(range);
    await db.transaction(async (tx) => {
      for (const spentTime of spentTimes.timesSpent) {
        const taskPayload: typeof kTasks.$inferInsert = {
          name: spentTime.task.subject,
          description: spentTime.task.subject,
          externalTrackerId: spentTime.task.id,
          platform: credentials.platform,
          projectId,
          employeeId,
          creationDate: format(new Date(spentTime.task.date), "yyyy-MM-dd"),
        };

        const res = await tx
          .insert(kTasks)
          .values(taskPayload)
          .onConflictDoUpdate({
            target: kTasks.externalTrackerId,
            set: taskPayload,
          })
          .returning({ taskId: kTasks.id });

        if (res.length != 1) {
          throw new Error(`Could not upsert task ${spentTime.task.id}`);
        }

        const { taskId } = firstOrThrow(res);

        console.log(
          `spending time for task ${spentTime.task.subject}: ${spentTime.spentTime}`,
        );
        const spentTimePayload: typeof kSpentTimes.$inferInsert = {
          duration: `${spentTime.spentTime} hour`,
          date: format(new Date(spentTime.date), "yyyy-MM-dd"),
          taskId: taskId,
          externalTrackerId: spentTime.task.id,
          platform: credentials.platform,
        };

        await tx
          .insert(kSpentTimes)
          .values(spentTimePayload)
          .onConflictDoUpdate({
            target: kSpentTimes.externalTrackerId,
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
