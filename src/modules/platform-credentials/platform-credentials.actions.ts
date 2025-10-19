"use server";
import { serverActionUtils } from "@/utils/server-actions.utils";
import { platformCredentialsServer } from "./platform-credentials.server";

export const platformCredentialsAllAction = serverActionUtils.createSafeAction(
    platformCredentialsServer.all,
);
export const platformCredentialsGetByOrganizationAction =
    serverActionUtils.createSafeAction(platformCredentialsServer.byClient);
export const platformCredentialsGetByIdAction =
    serverActionUtils.createSafeAction(platformCredentialsServer.byId);
export const platformCredentialsCreateAction =
    serverActionUtils.createSafeAction(platformCredentialsServer.create);
export const platformCredentialsDeleteAction =
    serverActionUtils.createSafeAction(platformCredentialsServer.delete);
