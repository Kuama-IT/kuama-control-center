"use server";
import { invoices } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import type { IssuedDocument } from "@fattureincloud/fattureincloud-ts-sdk";
import { invoicesService } from "./invoices.service";

const BATCH_SIZE = 100;
type KInvoiceInsert = typeof invoices.$inferInsert;

export const createInvoices = handleServerErrors(
  async (fattureInCloudInvoices: IssuedDocument[]) => {
    await invoicesService.createFromFattureInCloudDtos(fattureInCloudInvoices);
    return {
      success: true,
      message: "Invoices created successfully",
    };
  }
);
