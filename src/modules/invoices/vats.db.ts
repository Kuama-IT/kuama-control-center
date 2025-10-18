import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { vats } from "@/drizzle/schema";
import { type VatCreateDto } from "@/modules/invoices/schemas/vat.create";
import { firstOrThrow } from "@/utils/array-utils";

export const vatsDb = {
    async getById(id: number) {
        const res = await db.select().from(vats).where(eq(vats.id, id));

        return firstOrThrow(res);
    },
    async create(dto: VatCreateDto) {
        return firstOrThrow(
            await db
                .insert(vats)
                .values(dto)
                .onConflictDoUpdate({
                    target: vats.vat,
                    set: {
                        companyName: dto.companyName,
                        fattureInCloudId: dto.fattureInCloudId,
                    },
                })
                .returning(),
        );
    },
};
