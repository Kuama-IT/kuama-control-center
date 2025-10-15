"use server";
import { serverActionUtils } from "@/utils/server-actions.utils";
import { clientsServer } from "./clients.server";

export const importFromFattureInCloudAction =
    serverActionUtils.createSafeAction(clientsServer.importFromFattureInCloud, [
        "/clients",
        "/clients/settings/mappings",
    ]);

export const linkOrganizationToClientAction =
    serverActionUtils.createSafeAction(clientsServer.linkOrganization, [
        "/clients/settings/mappings",
    ]);
export const unlinkOrganizationFromClientAction =
    serverActionUtils.createSafeAction(clientsServer.unlinkOrganization, [
        "/clients/settings/mappings",
    ]);
