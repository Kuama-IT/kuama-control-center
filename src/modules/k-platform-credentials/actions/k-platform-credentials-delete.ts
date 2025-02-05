"use server";
import { kPlatformCredentials } from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { eq } from "drizzle-orm";

export const deleteKPlatformCredentials = async (credentialsId: number) => {
  await db
    .delete(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, credentialsId));
};
