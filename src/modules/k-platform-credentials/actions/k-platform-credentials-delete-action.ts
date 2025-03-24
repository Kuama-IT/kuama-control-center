"use server";
import {
  kPlatformCredentials,
  kPlatformCredentialsToEmployeesAndProjects,
} from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

const handled = handleServerErrors(async (credentialsId: number) => {
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }
  await db
    .delete(kPlatformCredentialsToEmployeesAndProjects)
    .where(
      eq(
        kPlatformCredentialsToEmployeesAndProjects.platformCredentialsId,
        credentialsId,
      ),
    );

  await db
    .delete(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, credentialsId));
});

export default handled;
