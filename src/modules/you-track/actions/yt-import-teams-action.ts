"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { db } from "@/drizzle/drizzle-db";
import { count, eq } from "drizzle-orm";
import { kEmployees, kProjects, kTeams, lower } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";

export default handleServerErrors(async () => {
  const ytProjects = await youtrackApiClient.getProjects();
  await db.transaction(async (tx) => {
    for (const ytProject of ytProjects) {
      const projectQuery = await tx
        .select()
        .from(kProjects)
        .where(eq(kProjects.youTrackRingId, ytProject.ringId));

      if (projectQuery.length === 0) {
        continue;
      }

      const project = firstOrThrow(projectQuery);

      for (const ytUser of ytProject.team.users ?? []) {
        if (!ytUser.profile.email?.email) {
          continue;
        }
        const employeeQuery = await tx
          .select()
          .from(kEmployees)
          .where(
            eq(
              lower(kEmployees.email),
              ytUser.profile.email?.email?.toLowerCase(),
            ),
          );

        if (employeeQuery.length > 0) {
          const payload: typeof kTeams.$inferInsert = {
            employeeId: employeeQuery[0].id,
            projectId: project.id,
          };

          await tx.insert(kTeams).values(payload).onConflictDoNothing();
        }
      }
    }
  });
});
