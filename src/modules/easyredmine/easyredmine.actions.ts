import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { handleServerErrors } from "@/utils/server-action-utils";
import { PlatformCredentialsRead } from "@/modules/platform-credentials/schemas/platform-credentials.schemas";


export const easyRedmineGetSpentTimes = handleServerErrors(async ({
  credentials,
  range,
}: {
  credentials: PlatformCredentialsRead;
  range: { from: Date; to: Date };
}) =>{
  const client = new EasyRedmineApiClient(
    credentials.endpoint,
    credentials.persistentToken,
  );

  return await client.getSpentTimes(range);
});
