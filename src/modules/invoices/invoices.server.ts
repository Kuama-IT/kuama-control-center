import { type IssuedDocument } from "@fattureincloud/fattureincloud-ts-sdk";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { invoices, invoicesSuppliers, vats } from "@/drizzle/schema";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api";
import { type VatReadDto } from "@/modules/invoices/schemas/vat.read";
import { vatsDb } from "@/modules/invoices/vats.db";
import { type SupplierReadDto } from "@/modules/suppliers/schemas/supplier.read";
import { suppliersDb } from "@/modules/suppliers/suppliers.db";
import { firstOrThrow } from "@/utils/array-utils";
import { type ServerActionResult } from "@/utils/server-actions.utils";

export const invoicesServer = {
    async createFromFattureInCloudDtos(issuedDocuments: IssuedDocument[]) {
        // group invoices by vat
        const invoicesByVat = new Map<string, IssuedDocument[]>();
        for (const fattureInCloudInvoice of issuedDocuments) {
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
                    number:
                        fattureInCloudInvoice.number?.toString() ?? "UNKNOWN",
                    type: fattureInCloudInvoice.type,
                };

                insertValues.push(record);
            }

            await tx.insert(invoices).values(insertValues);

            return { success: true, message: "Invoices created successfully" };
        });
    },

    async importReceivedInvoicesByDateFromFattureInCloud(dto: {
        from: Date;
        to: Date;
    }): Promise<ServerActionResult> {
        const fattureInCloudReceivedInvoices =
            await fattureInCloudApiClient.getReceivedInvoices({
                from: dto.from,
                to: dto.to,
            });

        const insertValues: (typeof invoices.$inferInsert)[] = [];

        for (const fattureInCloudInvoice of fattureInCloudReceivedInvoices) {
            const vat = fattureInCloudInvoice.entity?.vat_number;
            let vatRecord: VatReadDto | undefined;
            let supplier: SupplierReadDto | undefined;
            if (
                vat &&
                fattureInCloudInvoice.entity?.id &&
                fattureInCloudInvoice.entity.name
            ) {
                // ensure we do have this vat in database

                [vatRecord] = await db
                    .select()
                    .from(vats)
                    .where(eq(vats.vat, vat))
                    .limit(1);

                if (!vatRecord) {
                    console.error(fattureInCloudInvoice.entity);

                    vatRecord = await vatsDb.create({
                        fattureInCloudId:
                            fattureInCloudInvoice.entity.id.toString(),
                        companyName: fattureInCloudInvoice.entity.name,
                        vat,
                    });
                }
            }

            if (
                fattureInCloudInvoice.entity &&
                fattureInCloudInvoice.entity.id &&
                fattureInCloudInvoice.entity.name
            ) {
                supplier = await suppliersDb.tryGetByExternalId(
                    fattureInCloudInvoice.entity.id,
                );
                if (!supplier) {
                    // basically a company that is a supplier, but we did not add to fatture in cloud suppliers
                    supplier = await suppliersDb.create({
                        vatId: vatRecord?.id,
                        name: fattureInCloudInvoice.entity.name,
                        email: fattureInCloudInvoice.entity.email,
                        phone: fattureInCloudInvoice.entity.phone,
                        externalId: fattureInCloudInvoice.entity.id?.toString(),
                    });
                }
            }

            if (!supplier) {
                console.error(JSON.stringify(fattureInCloudInvoice));
                throw new Error("Invoice supplier is missing");
            }

            let date: string | undefined | null =
                fattureInCloudInvoice.payments_list?.[0]?.due_date;
            if (!date) {
                date = fattureInCloudInvoice.date;
            }

            if (!date) {
                console.error(JSON.stringify(fattureInCloudInvoice));
                throw new Error("Invoice due date is missing");
            }

            const record: typeof invoices.$inferInsert = {
                vat: vatRecord?.id,
                subject: fattureInCloudInvoice.description ?? "UNKNOWN",
                amountNet: fattureInCloudInvoice.amount_net ?? 0,
                amountGross: fattureInCloudInvoice.amount_gross ?? 0,
                amountVat: fattureInCloudInvoice.amount_vat ?? 0,
                date: fattureInCloudInvoice.date ?? "",
                dueDate: date,
                externalId: fattureInCloudInvoice.id?.toString() || "",
                number: fattureInCloudInvoice.invoice_number ?? "",
                type: fattureInCloudInvoice.type,
            };

            const res = firstOrThrow(
                await db
                    .insert(invoices)
                    .values(record)
                    .onConflictDoNothing()
                    .returning(),
            );

            await db.insert(invoicesSuppliers).values({
                supplierId: supplier.id,
                invoiceId: res.id,
            });

            insertValues.push(record);
        }

        return {
            message: `Imported ${insertValues.length} invoices`,
        };
    },
};
