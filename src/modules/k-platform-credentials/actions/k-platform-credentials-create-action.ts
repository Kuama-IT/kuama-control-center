"use server";
import { kPlatformCredentials } from "@/drizzle/schema";
import { KPlatformCredentialsInsert } from "@/drizzle/drizzle-types";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";

export default handleServerErrors(
  async (credentials: KPlatformCredentialsInsert) => {
    await db.insert(kPlatformCredentials).values(credentials);
  },
);
