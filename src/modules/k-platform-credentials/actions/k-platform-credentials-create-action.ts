"use server";
import {
  kPlatformCredentials,
  kPlatformCredentialsToEmployeesAndProjects,
} from "@/drizzle/schema";
import { KPlatformCredentialsInsert } from "@/drizzle/drizzle-types";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";

const handled = handleServerErrors(
  async (credentials: KPlatformCredentialsInsert & { clientId: number }) => {
    await db.transaction(async (tx) => {
      const results = await tx
        .insert(kPlatformCredentials)
        .values(credentials)
        .returning({ id: kPlatformCredentials.id });
      const result = firstOrThrow(results);
      await tx.insert(kPlatformCredentialsToEmployeesAndProjects).values({
        platformCredentialsId: result.id,
        //      employeeId: auth.userId, TODO PASS EMPLOYEE ID
        projectId: credentials.clientId,
      });
    });
  },
);

export default handled;
