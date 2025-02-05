"use server";
import { kPlatformCredentials } from "@/drizzle/schema";
import { KPlatformCredentialsInsert } from "@/drizzle/drizzle-types";
import { db } from "@/drizzle/drizzle-db";

export const createKPlatformCredentials = async (
  credentials: KPlatformCredentialsInsert,
) => {
  await db.insert(kPlatformCredentials).values(credentials);
};
