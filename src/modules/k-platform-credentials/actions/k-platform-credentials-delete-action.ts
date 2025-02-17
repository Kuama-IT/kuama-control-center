"use server";
import { kPlatformCredentials } from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

export default handleServerErrors(async (credentialsId: number) => {
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }
  await db
    .delete(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, credentialsId));
});
