"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees, kProjects } from "@/drizzle/schema";
import { inArray } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { KPlatformCredentialsFullRead } from "@/drizzle/drizzle-types";

const listAllKPlatformCredentials = async () => {
  const res = await db.query.kPlatformCredentials.findMany({
    with: {
      kPlatformCredentialsToEmployeesAndProjects: true,
    },
  });

  // Get all unique employee and project IDs
  const employeeIds = new Set<number>();
  const projectIds = new Set<number>();

  res.forEach(({ kPlatformCredentialsToEmployeesAndProjects }) => {
    kPlatformCredentialsToEmployeesAndProjects.forEach(
      ({ employeeId, projectId }) => {
        if (employeeId) employeeIds.add(employeeId);
        if (projectId) projectIds.add(projectId);
      },
    );
  });

  // Fetch all employees and projects in batch
  const employees =
    employeeIds.size > 0
      ? await db
          .select()
          .from(kEmployees)
          .where(inArray(kEmployees.id, Array.from(employeeIds)))
      : [];

  const projects =
    projectIds.size > 0
      ? await db
          .select()
          .from(kProjects)
          .where(inArray(kProjects.id, Array.from(projectIds)))
      : [];

  // Create lookup maps
  const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));
  const projectMap = new Map(projects.map((proj) => [proj.id, proj]));

  return await Promise.all(
    res.map(
      async ({ kPlatformCredentialsToEmployeesAndProjects, ...credential }) => {
        let credentialEnhanced: KPlatformCredentialsFullRead = {
          ...credential,
        };
        if (kPlatformCredentialsToEmployeesAndProjects.length > 0) {
          const relations = firstOrThrow(
            kPlatformCredentialsToEmployeesAndProjects,
          );

          const kProject = projectMap.get(relations.projectId);
          if (kProject) {
            credentialEnhanced = {
              ...credentialEnhanced,
              kProject,
            };
          }
          const kEmployee = employeeMap.get(relations.employeeId);
          if (kEmployee) {
            credentialEnhanced = {
              ...credentialEnhanced,
              kEmployee,
            };
          }
        }

        return credentialEnhanced;
      },
    ),
  );
};

const handled = handleServerErrors(listAllKPlatformCredentials);

export default handled;
