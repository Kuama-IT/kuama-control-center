import { db } from "@/drizzle/drizzle-db";
import { suppliers, vats } from "@/drizzle/schema";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api";
import { type VatCreateDto } from "@/modules/invoices/schemas/vat.create";
import { vatsDb } from "@/modules/invoices/vats.db";
import { type SupplierCreateDto } from "@/modules/suppliers/schemas/supplier.create";
import { type SupplierRead } from "@/modules/suppliers/schemas/supplier.read";
import { type SupplierReadExtended } from "@/modules/suppliers/schemas/supplier-read-extended";
import { suppliersDb } from "@/modules/suppliers/suppliers.db";
import { type ServerActionResult } from "@/utils/server-actions.utils";

export const suppliersServer = {
    async upsertAllFromFattureInCloud(): Promise<ServerActionResult> {
        const ficSuppliers = await fattureInCloudApiClient.getSuppliers();

        return await db.transaction(async (tx) => {
            for (const ficSupplier of ficSuppliers) {
                if (!ficSupplier.id) {
                    throw new Error(
                        `Found fatture in cloud supplier w/o id ${JSON.stringify(ficSupplier)}`,
                    );
                }
                if (!ficSupplier.name) {
                    throw new Error(
                        `Found fatture in cloud supplier w/o name ${ficSupplier.id}`,
                    );
                }

                const vat = ficSupplier.vat_number ?? ficSupplier.tax_code;
                if (!vat) {
                    throw new Error(
                        `Found fatture in cloud supplier w/o both vat number and tax code ${ficSupplier.name}`,
                    );
                }

                const vatValues: VatCreateDto = {
                    vat,
                    companyName: ficSupplier.name,
                };
                // upsert vat
                const [vatRecord] = await tx
                    .insert(vats)
                    .values(vatValues)
                    .onConflictDoUpdate({
                        target: vats.vat,
                        set: {
                            companyName: vatValues.companyName,
                        },
                    })
                    .returning();

                const supplierDto: SupplierCreateDto = {
                    vatId: vatRecord.id,
                    name: ficSupplier.name,
                    email: ficSupplier.email,
                    phone: ficSupplier.phone,
                    externalId: ficSupplier.id?.toString(),
                };
                await tx
                    .insert(suppliers)
                    .values(supplierDto)
                    .onConflictDoUpdate({
                        target: suppliers.externalId,
                        set: {
                            vatId: vatRecord.id,
                            name: ficSupplier.name,
                            email: ficSupplier.email,
                            phone: ficSupplier.phone,
                        },
                    });
            }

            return {
                message: `Imported ${ficSuppliers.length} suppliers`,
            };
        });
    },

    async allExtended(): Promise<SupplierReadExtended[]> {
        const supplierRecords = await suppliersDb.getAll();
        const res: SupplierReadExtended[] = [];
        for (const supplier of supplierRecords) {
            const vat = await vatsDb.getById(supplier.vatId);

            res.push({
                ...supplier,
                vat,
            });
        }

        return res;
    },
};
