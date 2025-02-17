"use server";
import { db } from "@/drizzle/drizzle-db";
import { kPlatformCredentials } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

export default handleServerErrors(async (clientId: number) => {
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }

  return await db
    .select()
    .from(kPlatformCredentials)
    .where(eq(kPlatformCredentials.clientId, clientId));
});
