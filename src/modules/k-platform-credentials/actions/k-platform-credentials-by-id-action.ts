"use server";
import { db } from "@/drizzle/drizzle-db";
import { kPlatformCredentials } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";

const handled = handleServerErrors(async (id: number) => {
  const records = await db
    .select()
    .from(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, id));

  return firstOrThrow(records);
});

export default handled;
