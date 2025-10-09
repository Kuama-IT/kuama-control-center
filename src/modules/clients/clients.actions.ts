"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { clientsServer } from "./clients.server";
import { serverActionUtils } from "@/utils/server-actions.utils";

export const listAllAction = handleServerErrors(clientsServer.listAll);
export const getOneAction = handleServerErrors(clientsServer.getOne);
export const getTasksAndSpentTimesAction = handleServerErrors(
  clientsServer.getTasksAndSpentTimes
);
export const getMonthlySpentTimesAction = handleServerErrors(
  clientsServer.getMonthlySpentTimes
);
export const getTotalInvoicedAmountAction = handleServerErrors(
  clientsServer.getTotalInvoicedAmount
);
export const getOverallInvoicedAmountAction = handleServerErrors(
  clientsServer.getOverallInvoicedAmount
);

// FIC import and YT mapping helpers for useServerMutation or admin UI
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
export const autoLinkYouTrackOrgsAction = serverActionUtils.createSafeAction(
  clientsServer.autoLinkYouTrackOrgs,
  ["/clients/settings/mappings"]
);

export type ClientsListAllActionResult = Awaited<
  ReturnType<typeof clientsServer.listAll>
>;
