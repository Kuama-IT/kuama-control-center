"use server";
import {
  clients,
  employees,
  platformCredentials,
  platformCredentialsToEmployeesAndProjects,
} from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import {
  kPlatformCredentialsInsertSchema,
  KPlatformCredentialsValidForm,
} from "@/modules/k-platform-credentials/schemas/k-platform-credentials.schemas";
import { eq } from "drizzle-orm";

const handled = handleServerErrors(
  async (credentials: KPlatformCredentialsValidForm) => {
    const parsedCredentials =
      kPlatformCredentialsInsertSchema.parse(credentials);

    await db.transaction(async (tx) => {
      const results = await tx
        .insert(platformCredentials)
        .values(parsedCredentials)
        .returning({ id: platformCredentials.id });
      const result = firstOrThrow(results);
      if (parsedCredentials.clientId && parsedCredentials.employeeId) {
        const client = await tx
          .select()
          .from(clients)
          .where(eq(clients.id, parsedCredentials.clientId))
          .limit(1);
        if (client.length === 0) {
          throw new Error(
            `Client with ID ${parsedCredentials.clientId} not found`,
          );
        }

        const employee = await tx
          .select()
          .from(employees)
          .where(eq(employees.id, parsedCredentials.employeeId))
          .limit(1);
        if (employee.length === 0) {
          throw new Error(
            `Employee with ID ${parsedCredentials.employeeId} not found`,
          );
        }

        await tx.insert(platformCredentialsToEmployeesAndProjects).values({
          platformCredentialsId: result.id,
          employeeId: parsedCredentials.employeeId,
          projectId: parsedCredentials.projectId,
        });
      }
    });
  },
);

export default handled;
