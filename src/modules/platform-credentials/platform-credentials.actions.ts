"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { platformCredentialsServer } from "./platform-credentials.server";
import type { PlatformCredentialsValidForm } from "./schemas/platform-credentials.schemas";

export const listAllAction = handleServerErrors(
  platformCredentialsServer.all,
);
export const byClientAction = handleServerErrors(
  platformCredentialsServer.byClient,
);
export const byIdAction = handleServerErrors(platformCredentialsServer.byId);
export const createAction = handleServerErrors(
  platformCredentialsServer.create,
);
export const deleteAction = handleServerErrors(
  platformCredentialsServer.delete,
);

export type PlatformCredentialsListAllActionResult = Awaited<
  ReturnType<typeof platformCredentialsServer.all>
>;
export type PlatformCredentialsByIdActionResult = Awaited<
  ReturnType<typeof platformCredentialsServer.byId>
>;
