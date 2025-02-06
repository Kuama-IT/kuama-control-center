"use server";
import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";

const action = async (credentialId: number) => {
  // do not make user to wait until import is done

  // TODO complete
  const credentials = await kPlatformCredentialsServer.byId(credentialId);

  if (!credentials) {
    throw new Error("Credentials not found");
  }

  // based on credentials provider, instantiate correct client and sync data
  if (credentials.platform === "easyredmine") {
    const client = new EasyRedmineApiClient(
      credentials.endpoint,
      credentials.persistentToken,
    );

    const spentTimes = await client.getSpentTimes(new Date());
  }

  await new Promise((resolve) => setTimeout(resolve, 6000));
  console.log("done internal action");
};

export default async function syncTimeSpentForClient(credentialId: number) {
  action(credentialId);
  console.log("done");
}
