import { getKPlatformCredentialsByClient } from "@/modules/k-platform-credentials/actions/k-platform-credentials-by-client";
import { createKPlatformCredentials } from "@/modules/k-platform-credentials/actions/k-platform-credentials-create";
import { getKPlatformCredentialsById } from "@/modules/k-platform-credentials/actions/k-platform-credentials-by-id";

export const kPlatformCredentialsServer = {
  byClient: getKPlatformCredentialsByClient,
  byId: getKPlatformCredentialsById,
  create: createKPlatformCredentials,
};
