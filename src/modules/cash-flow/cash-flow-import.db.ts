import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { cashFlowImport } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

export const cashFlowImportDb = {
    async getById(id: number) {
        const res = await db
            .select()
            .from(cashFlowImport)
            .where(eq(cashFlowImport.id, id));
        return firstOrThrow(res);
    },
};
