"use server";
import { db } from "@/drizzle/drizzle-db";
import { projects as projectsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

const handled = handleServerErrors(async (clientId: number) => {
  const projects = await db
    .select({
      projectId: projectsTable.id,
    })
    .from(projectsTable)
    .where(eq(projectsTable.clientId, clientId));

  return await db.query.kPlatformCredentials.findMany({
    with: {
      kPlatformCredentialsToEmployeesAndProjects: {
        where: (records, { inArray }) => {
          return inArray(
            records.projectId,
            projects.map((project) => project.projectId)
          );
        },
      },
    },
  });
});

export default handled;
