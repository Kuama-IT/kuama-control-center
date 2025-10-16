import { type IssuedDocument } from "@fattureincloud/fattureincloud-ts-sdk";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { invoices, vats } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

export const invoicesService = {
    async createFromFattureInCloudDtos(issuedDocuments: IssuedDocument[]) {
        // group invoices by vat
        const invoicesByVat = new Map<string, IssuedDocument[]>();
        for (const fattureInCloudInvoice of issuedDocuments) {
            // for some reason we are not receiving vat for Nimika...
            // if (
            //     fattureInCloudInvoice.entity?.name ===
            //     "Ennkaye Consulting Limited"
            // ) {
            //     fattureInCloudInvoice.entity.vat_number = "13352539";
            // }

            const vat = fattureInCloudInvoice.entity?.vat_number;

            if (!vat) {
                throw new Error(
                    "Found fatture in cloud invoice w/o vat number",
                );
            }
            if (!invoicesByVat.has(vat)) {
                invoicesByVat.set(vat, []);
            }
            invoicesByVat.get(vat)?.push(fattureInCloudInvoice);
        }

        const vatsValues = Array.from(invoicesByVat.keys())
            .map((vat) => `'${vat}'`)
            .join(", ");
        // ensure we have vats
        const missingVatsRows = await db.execute(
            sql`
      WITH vat_list AS (
        SELECT unnest(ARRAY[${sql.raw(vatsValues)}]) AS vat
      )
      SELECT vat_list.vat
      FROM vat_list
      LEFT JOIN ${vats} ON vat_list.vat = ${vats}.vat
      WHERE ${vats}.vat IS NULL;
    `,
        );

        const missingVats: string[] = missingVatsRows.map(
            (row) => row.vat as string,
        );

        if (missingVats.length > 0) {
            const values: (typeof vats.$inferInsert)[] = [];
            for (const vat of missingVats) {
                const fattureInCloudInvoice = invoicesByVat.get(vat)?.at(0);
                if (!fattureInCloudInvoice) {
                    continue;
                }

                const value: typeof vats.$inferInsert = {
                    vat: fattureInCloudInvoice.entity?.vat_number ?? "",
                    companyName:
                        fattureInCloudInvoice.entity?.name ?? "UNKNOWN",
                    fattureInCloudId:
                        fattureInCloudInvoice.entity?.id?.toString(),
                };
                values.push(value);
            }

            await db.transaction(async (tx) => {
                await tx.insert(vats).values(values);
            });
        }

        // do not return invoices that are already in the database
        return await db.transaction(async (tx) => {
            const existingInvoices = await tx
                .select()
                .from(invoices)
                .where(
                    inArray(
                        invoices.externalId,
                        issuedDocuments.map((doc) => doc.id?.toString() || ""),
                    ),
                );
            const existingInvoiceIds = new Set(
                existingInvoices.map((inv) => inv.externalId),
            );

            const newInvoices = issuedDocuments.filter(
                (doc) => doc.id && !existingInvoiceIds.has(doc.id.toString()),
            );
            if (newInvoices.length === 0) {
                return { success: true, message: "No new invoices to create" };
            }
            const insertValues: (typeof invoices.$inferInsert)[] = [];
            for (const fattureInCloudInvoice of newInvoices) {
                const vat = fattureInCloudInvoice.entity?.vat_number;
                if (!vat) {
                    console.error(fattureInCloudInvoice.entity);
                    throw new Error(
                        `Invoice entity VAT number is missing for ${fattureInCloudInvoice.number} - ${fattureInCloudInvoice.entity?.name}`,
                    );
                }
                const vatRecord = firstOrThrow(
                    await tx.select().from(vats).where(eq(vats.vat, vat)),
                );

                if (!fattureInCloudInvoice.payments_list?.[0]?.due_date) {
                    throw new Error("Invoice due date is missing");
                }
                const record: typeof invoices.$inferInsert = {
                    vat: vatRecord.id,
                    subject: fattureInCloudInvoice.subject ?? "UNKNOWN",
                    amountNet: fattureInCloudInvoice.amount_net ?? 0,
                    amountGross: fattureInCloudInvoice.amount_gross ?? 0,
                    amountVat: fattureInCloudInvoice.amount_vat ?? 0,
                    date: fattureInCloudInvoice.date ?? "",
                    dueDate: fattureInCloudInvoice.payments_list[0].due_date,
                    externalId: fattureInCloudInvoice.id?.toString() || "",
                    number: fattureInCloudInvoice.number ?? 0,
                };

                insertValues.push(record);
            }

            await tx.insert(invoices).values(insertValues);

            return { success: true, message: "Invoices created successfully" };
        });
    },
};
