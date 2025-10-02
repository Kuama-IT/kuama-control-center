import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { db } from "@/drizzle/drizzle-db";
import { projects as projectsTable } from "@/drizzle/schema";
import { ProjectRead } from "@/modules/projects/schemas/projects.read.schema";

export const syncYouTrackProjects = async (
  projectOrganizationMap: Map<string, number>
): Promise<ProjectRead[]> => {
  const youTrackProjects = await youtrackApiClient.getProjects();

  await db.transaction(async (tx) => {
    for (const project of youTrackProjects) {
      // does the project this work item belongs to exist in our database?
      const projectPayload: typeof projectsTable.$inferInsert = {
        name: project.name,
        youTrackRingId: project.ringId,
        clientId: projectOrganizationMap.get(project.ringId),
      };
      console.log(`syncYouTrackProjects -> ${project.name}`);
      await tx.insert(projectsTable).values(projectPayload).onConflictDoUpdate({
        target: projectsTable.youTrackRingId,
        set: projectPayload,
      });
    }
  });

  return db.select().from(projectsTable);
};
