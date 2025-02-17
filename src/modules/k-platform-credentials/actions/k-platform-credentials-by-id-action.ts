"use server";
import { db } from "@/drizzle/drizzle-db";
import { kPlatformCredentials } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";
import { firstOrThrow } from "@/utils/array-utils";

export default handleServerErrors(async (id: number) => {
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }

  const records = await db
    .select()
    .from(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, id));

  return firstOrThrow(records);
});
