import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { KPlatformCredentialsRead } from "@/drizzle/drizzle-types";
import { handleServerErrors } from "@/utils/server-action-utils";

async function easyRedmineGetSpentTimes({
  credentials,
  range,
}: {
  credentials: KPlatformCredentialsRead;
  range: { from: Date; to: Date };
}) {
  const client = new EasyRedmineApiClient(
    credentials.endpoint,
    credentials.persistentToken,
  );

  return await client.getSpentTimes(range);
}

export default handleServerErrors(easyRedmineGetSpentTimes);
