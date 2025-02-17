"use server";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kClientVats, kInvoices } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

const BATCH_SIZE = 100;
type KInvoiceInsert = typeof kInvoices.$inferInsert;

export default handleServerErrors(async () => {
  const fattureInCloudInvoices = await fattureInCloudApiClient.getInvoices();
  await db.transaction(async (tx) => {
    for (let i = 0; i < fattureInCloudInvoices.length; i += BATCH_SIZE) {
      const batch = fattureInCloudInvoices.slice(i, i + BATCH_SIZE);
      const records = await Promise.all(
        batch.map(async (fattureInCloudInvoice) => {
          const vat = fattureInCloudInvoice.entity?.vat_number;
          if (!vat) {
            return null;
          }
          const clientVat = await db
            .select()
            .from(kClientVats)
            .where(eq(kClientVats.vat, vat));
          if (clientVat.length === 0) {
            console.warn(
              `TODO missing client (probably not synced from YouTrack: Client VAT ${vat} not found`,
            );
            return null;
          }
          const record: KInvoiceInsert = {
            clientVat: clientVat[0].id,
            subject: fattureInCloudInvoice.subject ?? "UNKNOWN",
            amountNet: fattureInCloudInvoice.amount_net ?? 0,
            amountGross: fattureInCloudInvoice.amount_gross ?? 0,
            amountVat: fattureInCloudInvoice.amount_vat ?? 0,
            date: fattureInCloudInvoice.date ?? "",
            number: fattureInCloudInvoice.number ?? 0,
          };

          return record;
        }),
      );

      await tx
        .insert(kInvoices)
        .values(
          records.filter((record): record is KInvoiceInsert => record != null),
        )
        .onConflictDoNothing();
    }
  });
  return {
    success: true,
    message: "Invoices synced successfully",
  };
});
