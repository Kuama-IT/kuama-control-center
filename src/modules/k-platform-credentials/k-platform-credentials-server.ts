import getKPlatformCredentialsByClient from "@/modules/k-platform-credentials/actions/k-platform-credentials-by-client-action";
import getAllKPlatformCredentials from "@/modules/k-platform-credentials/actions/k-platform-credentials-list-action";
import createKPlatformCredentials from "@/modules/k-platform-credentials/actions/k-platform-credentials-create-action";
import getKPlatformCredentialsById from "@/modules/k-platform-credentials/actions/k-platform-credentials-by-id-action";

export const kPlatformCredentialsServer = {
  byClient: getKPlatformCredentialsByClient,
  all: getAllKPlatformCredentials,
  byId: getKPlatformCredentialsById,
  create: createKPlatformCredentials,
};
