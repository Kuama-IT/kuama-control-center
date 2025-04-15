import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { handleServerErrors } from "@/utils/server-action-utils";
import { KPlatformCredentialsRead } from "@/modules/k-platform-credentials/schemas/k-platform-credentials-schemas";

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

const handled = handleServerErrors(easyRedmineGetSpentTimes);
export default handled;
