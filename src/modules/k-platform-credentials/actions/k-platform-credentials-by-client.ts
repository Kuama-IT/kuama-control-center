import { db } from "@/drizzle/drizzle-db";
import { kPlatformCredentials } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getKPlatformCredentialsByClient = async (clientId: number) => {
  // TODO this should be just for admins
  return await db
    .select()
    .from(kPlatformCredentials)
    .where(eq(kPlatformCredentials.clientId, clientId));
};
