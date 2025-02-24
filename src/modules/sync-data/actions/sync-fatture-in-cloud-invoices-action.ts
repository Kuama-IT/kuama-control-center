"use server";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kVats, kInvoices } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import type { IssuedDocument } from "@fattureincloud/fattureincloud-ts-sdk";

const BATCH_SIZE = 100;
type KInvoiceInsert = typeof kInvoices.$inferInsert;

export default handleServerErrors(async () => {
  const fattureInCloudInvoices = await fattureInCloudApiClient.getInvoices();
  // group invoices by vat
  const invoicesByVat = new Map<string, IssuedDocument[]>();
  for (const fattureInCloudInvoice of fattureInCloudInvoices) {
    const vat = fattureInCloudInvoice.entity?.vat_number;
    if (!vat) {
      continue;
    }
    if (!invoicesByVat.has(vat)) {
      invoicesByVat.set(vat, []);
    }
    invoicesByVat.get(vat)?.push(fattureInCloudInvoice);
  }

  const vats = Array.from(invoicesByVat.keys())
    .map((vat) => `'${vat}'`)
    .join(", ");
  // ensure we have vats
  const missingVatsRows = await db.execute(
    sql`
      WITH vat_list AS (
        SELECT unnest(ARRAY[${sql.raw(vats)}]) AS vat
      )
      SELECT vat_list.vat
      FROM vat_list
      LEFT JOIN ${kVats} ON vat_list.vat = ${kVats}.vat
      WHERE ${kVats}.vat IS NULL;
    `,
  );

  const missingVats: string[] = missingVatsRows.map((row) => row.vat as string);

  if (missingVats.length > 0) {
    const values: (typeof kVats.$inferInsert)[] = [];
    for (const vat of missingVats) {
      const fattureInCloudInvoice = invoicesByVat.get(vat)?.at(0);
      if (!fattureInCloudInvoice) {
        continue;
      }

      const value: typeof kVats.$inferInsert = {
        vat: fattureInCloudInvoice.entity?.vat_number ?? "",
        companyName: fattureInCloudInvoice.entity?.name ?? "UNKNOWN",
        fattureInCloudId: fattureInCloudInvoice.entity?.id?.toString(),
      };
      values.push(value);
    }

    await db.transaction(async (tx) => {
      await tx.insert(kVats).values(values);
    });
  }

  // store invoices
  await db.transaction(async (tx) => {
    for (let i = 0; i < fattureInCloudInvoices.length; i += BATCH_SIZE) {
      const batch = fattureInCloudInvoices.slice(i, i + BATCH_SIZE);
      const records = await Promise.all(
        batch.map(async (fattureInCloudInvoice) => {
          const vat = fattureInCloudInvoice.entity?.vat_number;
          if (!vat) {
            return null;
          }
          const vatRecords = await db
            .select()
            .from(kVats)
            .where(eq(kVats.vat, vat));

          const vatRecord = firstOrThrow(vatRecords);

          const record: KInvoiceInsert = {
            vat: vatRecord.id,
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
