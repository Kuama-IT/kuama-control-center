"use server";
import { db } from "@/drizzle/drizzle-db";
import { employees, projects as projectsTable } from "@/drizzle/schema";
import { inArray } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { KPlatformCredentialsFullRead } from "@/modules/k-platform-credentials/schemas/k-platform-credentials.schemas";

const listAllPlatformCredentials = async () => {
  const res = await db.query.platformCredentials.findMany({
    with: {
      platformCredentialsToEmployeesAndProjects: true,
    },
  });

  // Get all unique employee and project IDs
  const employeeIds = new Set<number>();
  const projectIds = new Set<number>();

  res.forEach(({ platformCredentialsToEmployeesAndProjects }) => {
    platformCredentialsToEmployeesAndProjects.forEach(
      ({ employeeId, projectId }) => {
        if (employeeId) employeeIds.add(employeeId);
        if (projectId) projectIds.add(projectId);
      }
    );
  });

  // Fetch all employees and projects in batch
  const employeesResult =
    employeeIds.size > 0
      ? await db
          .select()
          .from(employees)
          .where(inArray(employees.id, Array.from(employeeIds)))
      : [];

  const projectsResult =
    projectIds.size > 0
      ? await db
          .select()
          .from(projectsTable)
          .where(inArray(projectsTable.id, Array.from(projectIds)))
      : [];

  // Create lookup maps
  const employeeMap = new Map(employeesResult.map((emp) => [emp.id, emp]));
  const projectMap = new Map(projectsResult.map((proj) => [proj.id, proj]));

  return await Promise.all(
    res.map(
      async ({ platformCredentialsToEmployeesAndProjects, ...credential }) => {
        let credentialEnhanced: KPlatformCredentialsFullRead = {
          ...credential,
        };
        if (platformCredentialsToEmployeesAndProjects.length > 0) {
          const relations = firstOrThrow(
            platformCredentialsToEmployeesAndProjects
          );

          const project = projectMap.get(relations.projectId);
          if (project) {
            credentialEnhanced = {
              ...credentialEnhanced,
              project,
            };
          }
          const employee = employeeMap.get(relations.employeeId);
          if (employee) {
            credentialEnhanced = {
              ...credentialEnhanced,
              employee,
            };
          }
        }

        return credentialEnhanced;
      }
    )
  );
};

const handled = handleServerErrors(listAllPlatformCredentials);

export default handled;
