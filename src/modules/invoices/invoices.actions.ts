"use server";
import { serverActionUtils } from "@/utils/server-actions.utils";
import { invoicesService } from "./invoices.service";

export const createInvoices = serverActionUtils.createSafeAction(
    invoicesService.createFromFattureInCloudDtos,
);
