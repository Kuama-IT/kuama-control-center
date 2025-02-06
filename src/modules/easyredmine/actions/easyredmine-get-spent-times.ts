import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { KPlatformCredentialsRead } from "@/drizzle/drizzle-types";

export default async function easyRedmineGetSpentTimes(
  credentials: KPlatformCredentialsRead,
  date: Date,
) {
  const client = new EasyRedmineApiClient(
    credentials.endpoint,
    credentials.persistentToken,
  );

  return await client.getSpentTimes(date);
}
