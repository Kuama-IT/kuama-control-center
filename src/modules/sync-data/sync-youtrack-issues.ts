import {
  WorkTimeListResponse,
  YouTrackIssue,
} from "@/modules/you-track/schemas/youtrack-schemas";
import { db } from "@/drizzle/drizzle-db";
import { tasks, teams } from "@/drizzle/schema";

import { format } from "date-fns";
import { ProjectRead } from "@/modules/projects/schemas/projects.read.schema";

export type SyncYouTrackIssuesFromWorkItemsResult = {
  id: number;
  youTrackId: string;
}[];

export const syncYouTrackIssuesFromWorkItems = async (
  workItems: WorkTimeListResponse,
  projects: ProjectRead[],
  employeeId: number
) => {
  console.log(`syncYouTrackIssuesFromWorkItems -> ${workItems.length}`);
  const workItemsIssues = workItems.map((workItem) => workItem.issue);
  // ensure we do not have dup issues
  const workItemsIssuesMap = new Map<string, YouTrackIssue>();
  const teamProjectsMap = new Map<string, number>();
  const allProjectIdsMap = projects.reduce((acc, project) => {
    if (!project.youTrackRingId) {
      throw new Error(`Project ${project.id} does not have a ringId`);
    }
    acc.set(project.youTrackRingId, project.id);
    return acc;
  }, new Map<string, number>());

  for (const issue of workItemsIssues) {
    if (!workItemsIssuesMap.has(issue.id)) {
      workItemsIssuesMap.set(issue.id, issue);
    }
    if (!teamProjectsMap.has(issue.project.ringId)) {
      const projectId = allProjectIdsMap.get(issue.project.ringId);
      if (!projectId) {
        throw new Error(`Project not found for issue ${issue.id}`);
      }
      teamProjectsMap.set(issue.project.ringId, projectId);
    }
  }

  const issues = Array.from(workItemsIssuesMap.values());
  const tasksData: SyncYouTrackIssuesFromWorkItemsResult = [];

  console.log(`syncing teams`);

  // if a user logged time for a task of this project, it should be inside the project's team
  // get all projects unique
  await db.transaction(async (tx) => {
    for (const [projectRingId, projectId] of teamProjectsMap) {
      const payload: typeof teams.$inferInsert = {
        employeeId: employeeId,
        projectId: projectId,
      };

      await tx.insert(teams).values(payload).onConflictDoNothing();
    }
  });

  console.log(`prepping transaction on ${issues.length} issues`);

  await db.transaction(async (tx) => {
    for (const issue of issues) {
      const project = projects.find(
        (it) => it.youTrackRingId === issue.project.ringId
      );

      if (!project) {
        throw new Error(`Project not found for issue ${issue.id}`);
      }

      const taskPayload: typeof tasks.$inferInsert = {
        name: issue.idReadable,
        description: issue.summary,
        externalTrackerId: issue.id,
        platform: "youtrack",
        projectId: project.id,
        employeeId: employeeId,
        creationDate: format(new Date(issue.created), "yyyy-MM-dd"),
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
        throw new Error(`Could not upsert task ${issue.id}`);
      }
      tasksData.push({ id: res[0].taskId, youTrackId: issue.id });
    }
  });

  return tasksData;
};
