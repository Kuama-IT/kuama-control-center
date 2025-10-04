"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { db } from "@/drizzle/drizzle-db";
import { eq } from "drizzle-orm";
import {
  employees,
  projects as projectsTable,
  teams,
  lower,
} from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

const handled = handleServerErrors(async () => {
  const ytProjects = await youtrackApiClient.getProjects();
  let teamsCreated = 0;
  let projectsProcessed = 0;
  let skippedProjects = 0;

  await db.transaction(async (tx) => {
    for (const ytProject of ytProjects) {
      const projectQuery = await tx
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.youTrackRingId, ytProject.ringId));

      if (projectQuery.length === 0) {
        skippedProjects++;
        continue;
      }

      const project = firstOrThrow(projectQuery);

      projectsProcessed++;
      for (const ytUser of ytProject.team.users ?? []) {
        if (!ytUser.profile.email?.email) {
          continue;
        }
        const employeeQuery = await tx
          .select()
          .from(employees)
          .where(
            eq(
              lower(employees.email),
              ytUser.profile.email?.email?.toLowerCase()
            )
          );

        if (employeeQuery.length > 0) {
          const payload: typeof teams.$inferInsert = {
            employeeId: employeeQuery[0].id,
            projectId: project.id,
          };

          // Track successful team creation
          teamsCreated++;
          await tx.insert(teams).values(payload).onConflictDoNothing();
        }
      }
    }
  });
  return {
    message: `LEGEN-DARY! Created ${teamsCreated} team associations across ${projectsProcessed} projects! (Skipped ${skippedProjects} projects)`,
  };
});

export default handled;
