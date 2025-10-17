import { db } from "@/drizzle/drizzle-db";
import { suppliers, vats } from "@/drizzle/schema";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api";
import { type VatCreateDto } from "@/modules/invoices/schemas/vat.create";
import { type VatReadDto } from "@/modules/invoices/schemas/vat.read";
import { vatsDb } from "@/modules/invoices/vats.db";
import { type SupplierCreateDto } from "@/modules/suppliers/schemas/supplier.create";
import { type SupplierReadExtended } from "@/modules/suppliers/schemas/supplier-read-extended";
import { suppliersDb } from "@/modules/suppliers/suppliers.db";
import { type ServerActionResult } from "@/utils/server-actions.utils";

export const suppliersServer = {
    async upsertAllFromFattureInCloud(): Promise<ServerActionResult> {
        const ficSuppliers = await fattureInCloudApiClient.getSuppliers();

        const supplierValues = await db.transaction(async (tx) => {
            const values: SupplierCreateDto[] = [];
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
                let vatRecord: VatReadDto | undefined;
                if (vat) {
                    const vatValue: VatCreateDto = {
                        vat,
                        companyName: ficSupplier.name,
                    };
                    // upsert vat
                    [vatRecord] = await tx
                        .insert(vats)
                        .values(vatValue)
                        .onConflictDoUpdate({
                            target: vats.vat,
                            set: {
                                companyName: vatValue.companyName,
                            },
                        })
                        .returning();
                }

                const supplierDto: SupplierCreateDto = {
                    vatId: vatRecord?.id,
                    name: ficSupplier.name,
                    email: ficSupplier.email,
                    phone: ficSupplier.phone,
                    externalId: ficSupplier.id?.toString(),
                };

                values.push(supplierDto);
            }

            return values;
        });

        for (const supplierValue of supplierValues) {
            try {
                await db
                    .insert(suppliers)
                    .values(supplierValue)
                    .onConflictDoUpdate({
                        target: suppliers.externalId,
                        set: {
                            vatId: supplierValue.vatId,
                            name: supplierValue.name,
                            email: supplierValue.email,
                            phone: supplierValue.phone,
                        },
                    });
            } catch (e) {
                console.error(`While creating`, supplierValue);
                console.error(e);
                throw e;
            }
        }

        return {
            message: `Imported ${supplierValues.length} suppliers`,
        };
    },

    async allExtended(): Promise<SupplierReadExtended[]> {
        const supplierRecords = await suppliersDb.getAll();
        const res: SupplierReadExtended[] = [];
        for (const supplier of supplierRecords) {
            const vat = supplier.vatId
                ? await vatsDb.getById(supplier.vatId)
                : undefined;

            res.push({
                ...supplier,
                vat,
            });
        }

        return res;
    },
};
