import getKPlatformCredentialsByClient from "@/modules/k-platform-credentials/actions/k-platform-credentials-by-client-action";
import createKPlatformCredentials from "@/modules/k-platform-credentials/actions/k-platform-credentials-create-action";
import getKPlatformCredentialsById from "@/modules/k-platform-credentials/actions/k-platform-credentials-by-id-action";

export const kPlatformCredentialsServer = {
  byClient: getKPlatformCredentialsByClient,
  byId: getKPlatformCredentialsById,
  create: createKPlatformCredentials,
};
