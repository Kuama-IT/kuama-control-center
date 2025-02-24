"use server";
import { db } from "@/drizzle/drizzle-db";
import {
  kPlatformCredentials,
  kPlatformCredentialsToEmployeesAndProjects,
  kProjects,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

export default handleServerErrors(async (clientId: number) => {
  const projects = await db
    .select({
      projectId: kProjects.id,
    })
    .from(kProjects)
    .where(eq(kProjects.clientId, clientId));

  return await db.query.kPlatformCredentials.findMany({
    with: {
      kPlatformCredentialsToEmployeesAndProjects: {
        where: (records, { inArray }) => {
          return inArray(
            records.projectId,
            projects.map((project) => project.projectId),
          );
        },
      },
    },
  });
});
