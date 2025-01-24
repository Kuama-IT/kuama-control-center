import { ReducedUser } from "@/modules/you-track/schemas/youtrack-schemas";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees, kProjects, kSpentTimes, kTasks } from "@/drizzle/schema";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { format } from "date-fns";

/**
 * This functions assumes that all YT projects are already in the database
 * @param user
 */
export const syncYouTrackUser = async (user: ReducedUser) => {
  const employeePayload: typeof kEmployees.$inferInsert = {
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
  // ensure we do have the user as employee in our database
  const res = await db
    .insert(kEmployees)
    .values(employeePayload)
    .onConflictDoUpdate({
      target: kEmployees.email,
      set: employeePayload,
    })
    .returning({ employeeId: kEmployees.id });

  const employee = res[0];
  if (!employee || res.length != 1) {
    throw new Error(
      `Inconsistent number of employees for YT user ${user.email}: ${res.length}`,
    );
  }

  const employeeId = employee.employeeId;

  // TODO we should probably sync just this month

  const workItems = await youtrackApiClient.getWorkItems(user.email);

  if (!workItems) {
    return;
  }

  // db.select({workItems: kTasks}) // select all

  const projects = await db.select().from(kProjects);

  // upsert tasks
  const workItemsIssues = workItems.map((workItem) => workItem.issue);
  // ensure we do not have dup issues
  workItemsIssues.reduce((acc, issue) => {
    if (!acc.has(issue.id)) {
      acc.set(issue.id, issue);
    }

    return acc;
  }, new Map<string, { idReadable: string; id: string; summary: string; project: { ringId: string } }>());

  const issues = Array.from(workItemsIssues.values());
  const tasks: { id: number; youTrackId: string }[] = [];
  await db.transaction(async (tx) => {
    for (const issue of issues) {
      const project = projects.find(
        (it) => it.youTrackRingId === issue.project.ringId,
      );

      if (!project) {
        throw new Error(`Project not found for issue ${issue.id}`);
      }

      const taskPayload: typeof kTasks.$inferInsert = {
        name: issue.idReadable,
        description: issue.summary,
        youTrackId: issue.id,
        projectId: project.id,
        employeeId: employeeId,
      };

      const res = await tx
        .insert(kTasks)
        .values(taskPayload)
        .onConflictDoUpdate({
          target: kTasks.youTrackId,
          set: taskPayload,
        })
        .returning({ taskId: kTasks.id });

      // TODO check if res is empty
      tasks.push({ id: res[0].taskId, youTrackId: issue.id });
    }
  });

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
        duration: `${workItem.duration.minutes} minutes`,
        date: format(new Date(workItem.date), "yyyy-MM-dd"),
        taskId: task?.id,
        youTrackId: workItem.id,
      };
      await tx
        .insert(kSpentTimes)
        .values(spentTimePayload)
        .onConflictDoUpdate({
          target: kSpentTimes.youTrackId,
          set: spentTimePayload,
        })
        .returning({ taskId: kTasks.id });
    }
  });
};
