"use server";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kClientVats, kInvoices } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";

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

          let clientVatId = clientVat[0]?.id;
          if (!clientVatId) {
            // create client vat
            const fattureInCloudClientId = fattureInCloudInvoice.entity?.id;
            if (!fattureInCloudClientId) {
              throw new Error("Fatture in Cloud Client has nullish id");
            }

            const clientVatRecord: typeof kClientVats.$inferInsert = {
              vat,
              companyName: fattureInCloudInvoice.entity?.name ?? "UNKNOWN",
              fattureInCloudId: fattureInCloudClientId.toString(),
            };
            const res = await tx
              .insert(kClientVats)
              .values(clientVatRecord)
              .returning({ insertedId: kClientVats.id });
            const { insertedId } = firstOrThrow(res);
            clientVatId = insertedId;
          }

          const record: KInvoiceInsert = {
            clientVat: clientVatId,
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
