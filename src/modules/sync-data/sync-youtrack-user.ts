import { ReducedUser } from "@/modules/you-track/schemas/youtrack-schemas";
import { db } from "@/drizzle/drizzle-db";
import { kSpentTimes } from "@/drizzle/schema";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { format } from "date-fns";

import { syncYouTrackIssuesFromWorkItems } from "@/modules/sync-data/sync-youtrack-issues";
import { KProjectsRead } from "@/modules/k-projects/schemas/k-projects-schemas";

/**
 * This functions assumes that all YT projects are already in the database
 * @param user
 * @param projects
 */
export const syncYouTrackUser = async (
  user: ReducedUser & { employeeId: number },
  projects: KProjectsRead[],
) => {
  const employeeId = user.employeeId;

  // TODO we should probably sync just this month

  console.log(`fetching work items for ${user.email}`);
  console.time(`fetching work items for ${user.email}`);

  const workItems = (await youtrackApiClient.getWorkItems(user.email!)) ?? [];

  for (const relatedEmail in user.relatedUserEmails) {
    console.log(`fetching work items for ${relatedEmail}`);
    const relatedWorkItems =
      (await youtrackApiClient.getWorkItems(relatedEmail)) ?? [];
    workItems.push(...relatedWorkItems);
  }
  if (workItems.length === 0) {
    console.log(`no work items for ${user.email}`);
    return;
  }

  console.timeEnd(`fetching work items for ${user.email}`);

  // db.select({workItems: kTasks}) // select all

  // upsert tasks

  console.log(`syncing tasks for ${user.email}`);
  console.time(`syncing tasks for ${user.email}`);
  const tasks = await syncYouTrackIssuesFromWorkItems(
    workItems,
    projects,
    employeeId,
  );
  console.timeEnd(`syncing tasks for ${user.email}`);
  // const tasks = await db
  //   .select()
  //   .from(kTasks)
  //   .where(eq(kTasks.employeeId, employeeId));

  console.log(`syncing work items -> ${user.email}`);
  console.time(`syncing work items -> ${user.email}`);

  await db.transaction(async (tx) => {
    for (const workItem of workItems) {
      const project = projects.find(
        (it) => it.youTrackRingId === workItem.issue.project.ringId,
      );

      if (!project) {
        throw new Error(`Project not found for work item ${workItem.id}`);
      }

      const task = tasks.find((it) => it.youTrackId === workItem.issue.id);

      if (!task) {
        throw new Error(`Task not found for work item ${workItem.id}`);
      }

      const spentTimePayload: typeof kSpentTimes.$inferInsert = {
        duration: `${workItem.duration.minutes} minute`,
        date: format(new Date(workItem.date), "yyyy-MM-dd"),
        taskId: task?.id,
        externalTrackerId: workItem.id,
        platform: "youtrack",
      };

      await tx.insert(kSpentTimes).values(spentTimePayload).onConflictDoUpdate({
        target: kSpentTimes.externalTrackerId,
        set: spentTimePayload,
      });
    }
  });
  console.timeEnd(`syncing work items -> ${user.email}`);
  console.log(`synced work items -> ${user.email}`);
};
