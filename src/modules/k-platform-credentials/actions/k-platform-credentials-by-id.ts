import { db } from "@/drizzle/drizzle-db";
import { kPlatformCredentials } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const getKPlatformCredentialsById = async (id: number) => {
  // TODO this should be just for admins

  const records = await db
    .select()
    .from(kPlatformCredentials)
    .where(eq(kPlatformCredentials.id, id));

  return records[0]; // TODO check and eventually throw error
};
