import { db } from "@/drizzle/drizzle-db";
import { kPlatformCredentials } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const getKPlatformCredentialsByClient = async (
  clientId: number,
  projectId: undefined | number = undefined,
) => {
  // TODO this should be just for admins
  const conditions = projectId
    ? and(
        eq(kPlatformCredentials.clientId, clientId),
        eq(kPlatformCredentials.projectId, projectId),
      )
    : eq(kPlatformCredentials.clientId, clientId);
  const records = await db
    .select()
    .from(kPlatformCredentials)
    .where(conditions);

  return records;
};
