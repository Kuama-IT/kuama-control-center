"use server";
import { serverActionUtils } from "@/utils/server-actions.utils";
import { invoicesServer } from "./invoices.server";

export const createInvoices = serverActionUtils.createSafeAction(
    invoicesServer.createFromFattureInCloudDtos,
);

export const importReceivedInvoicesByDateFromFattureInCloudAction =
    serverActionUtils.createSafeAction(
        invoicesServer.importReceivedInvoicesByDateFromFattureInCloud,
    );
