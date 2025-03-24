"use server";
import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { EasyRedmineApiClient } from "@/modules/easyredmine/easyredmine-api-client";
import { handleServerErrors, isFailure } from "@/utils/server-action-utils";

const action = async (
  credentialId: number,
  range: { from: Date; to: Date },
) => {
  // TODO complete
  const credentials = await kPlatformCredentialsServer.byId(credentialId);

  if (isFailure(credentials)) {
    throw new Error(JSON.parse(credentials.message));
  }
  if (!credentials) {
    throw new Error("Credentials not found");
  }

  // based on credentials provider, instantiate correct client and sync data
  if (credentials.platform === "easyredmine") {
    const client = new EasyRedmineApiClient(
      credentials.endpoint,
      credentials.persistentToken,
    );

    const spentTimes = await client.getSpentTimes(range);
    console.log(spentTimes);
  }

  await new Promise((resolve) => setTimeout(resolve, 6000));
  console.log("done internal action");
};

const handled = handleServerErrors(
  async (credentialId: number, range: { from: Date; to: Date }) => {
    // do not make user to wait until import is done
    void action(credentialId, range);
    console.log("request completed");
  },
);

export default handled;
