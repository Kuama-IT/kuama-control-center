"use server";
import { db } from "@/drizzle/drizzle-db";
import {
  kEmployees,
  kPlatformCredentials,
  kPlatformCredentialsToEmployeesAndProjects,
  projects as projectsTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { KPlatformCredentialsFullRead } from "@/modules/k-platform-credentials/schemas/k-platform-credentials-schemas";

const handled = handleServerErrors(async (id: number) => {
  const records = await db
    .select()
    .from(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, id));

  const credentials = firstOrThrow(records);
  const relatedEntities = await db
    .select()
    .from(kPlatformCredentialsToEmployeesAndProjects)
    .where(
      eq(kPlatformCredentialsToEmployeesAndProjects.platformCredentialsId, id)
    )
    .limit(1);

  let credentialEnhanced: KPlatformCredentialsFullRead = {
    ...credentials,
  };

  if (relatedEntities.length > 0) {
    const relations = firstOrThrow(relatedEntities);
    const { projectId, employeeId } = relations;
    if (projectId) {
      const projectRes = await db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.id, projectId))
        .limit(1);
      const project = firstOrThrow(projectRes);
      credentialEnhanced = {
        ...credentialEnhanced,
        project,
      };
    }
    if (employeeId) {
      const employeeRes = await db
        .select()
        .from(kEmployees)
        .where(eq(kEmployees.id, employeeId))
        .limit(1);
      const employee = firstOrThrow(employeeRes);
      credentialEnhanced = {
        ...credentialEnhanced,
        employee,
      };
    }
  }

  return credentialEnhanced;
});

export default handled;
