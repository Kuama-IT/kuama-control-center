"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { accessTokensServer } from "./access-tokens.server";

export const createAccessToken = handleServerErrors(accessTokensServer.create);
export const deleteAccessToken = handleServerErrors(accessTokensServer.remove);
export const listAccessTokens = handleServerErrors(accessTokensServer.list);
export const getUnlimitedAccessToken = handleServerErrors(
  accessTokensServer.getUnlimitedToken
);
export const manageAccessTokenUsage = handleServerErrors(
  accessTokensServer.manage
);

export type {
  AccessTokenCreateResult as CreateAccessTokenResult,
  AccessTokenDeleteResult as DeleteAccessTokenResult,
  AccessTokenListResult as ListAccessTokensResult,
} from "./schemas/access-token.schema";
