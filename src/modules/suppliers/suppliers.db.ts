import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { suppliers } from "@/drizzle/schema";
import { type SupplierCreateDto } from "@/modules/suppliers/schemas/supplier.create";
import { firstOrThrow } from "@/utils/array-utils";

export const suppliersDb = {
    getAll() {
        return db.select().from(suppliers);
    },
    async tryGetByExternalId(externalId: number) {
        const res = await db
            .select()
            .from(suppliers)
            .where(eq(suppliers.externalId, externalId.toString()))
            .limit(1);

        return res[0] ?? null;
    },
    async create(dto: SupplierCreateDto) {
        return firstOrThrow(
            await db
                .insert(suppliers)
                .values(dto)
                .onConflictDoUpdate({
                    target: suppliers.externalId,
                    set: {
                        vatId: dto.vatId,
                        name: dto.name,
                        email: dto.email,
                        phone: dto.phone,
                    },
                })
                .returning(),
        );
    },
};
