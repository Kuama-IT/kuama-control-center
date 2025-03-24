"use server";
import {
  kClients,
  kEmployees,
  kPlatformCredentials,
  kPlatformCredentialsToEmployeesAndProjects,
} from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import {
  kPlatformCredentialsInsertSchema,
  KPlatformCredentialsValidForm,
} from "@/modules/k-platform-credentials/schemas/k-platform-credentials-schemas";
import { eq } from "drizzle-orm";

const handled = handleServerErrors(
  async (credentials: KPlatformCredentialsValidForm) => {
    const parsedCredentials =
      kPlatformCredentialsInsertSchema.parse(credentials);

    await db.transaction(async (tx) => {
      const results = await tx
        .insert(kPlatformCredentials)
        .values(parsedCredentials)
        .returning({ id: kPlatformCredentials.id });
      const result = firstOrThrow(results);
      if (parsedCredentials.clientId && parsedCredentials.employeeId) {
        const client = await tx
          .select()
          .from(kClients)
          .where(eq(kClients.id, parsedCredentials.clientId))
          .limit(1);
        if (client.length === 0) {
          throw new Error(
            `Client with ID ${parsedCredentials.clientId} not found`,
          );
        }

        const employee = await tx
          .select()
          .from(kEmployees)
          .where(eq(kEmployees.id, parsedCredentials.employeeId))
          .limit(1);
        if (employee.length === 0) {
          throw new Error(
            `Employee with ID ${parsedCredentials.employeeId} not found`,
          );
        }

        await tx.insert(kPlatformCredentialsToEmployeesAndProjects).values({
          platformCredentialsId: result.id,
          employeeId: parsedCredentials.employeeId,
          projectId: parsedCredentials.projectId,
        });
      }
    });
  },
);

export default handled;
