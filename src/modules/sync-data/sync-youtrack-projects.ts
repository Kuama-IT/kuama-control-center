import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kProjects } from "@/drizzle/schema";
import { KProjectsRead } from "@/drizzle/drizzle-types";

export const syncYouTrackProjects = async (
  projectOrganizationMap: Map<string, number>,
): Promise<KProjectsRead[]> => {
  const projects = await youtrackApiClient.getProjects();

  await db.transaction(async (tx) => {
    for (const project of projects) {
      // does the project this work item belongs to exist in our database?
      const projectPayload: typeof kProjects.$inferInsert = {
        name: project.name,
        youTrackRingId: project.ringId,
        clientId: projectOrganizationMap.get(project.ringId),
      };
      console.log(`syncYouTrackProjects -> ${project.name}`);
      await tx.insert(kProjects).values(projectPayload).onConflictDoUpdate({
        target: kProjects.youTrackRingId,
        set: projectPayload,
      });
    }
  });

  return db.select().from(kProjects);
};
