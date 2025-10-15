import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { cashFlowImport } from "@/drizzle/schema";
import { cashFlowImportDb } from "@/modules/cash-flow/cash-flow-import.db";
import { type CashFlowImportRead } from "@/modules/cash-flow/schemas/cash-flow-import-read";

export const cashFlowImportServer = {
    async flagAsImported({ id }: { id: number }) {
        const { id: _id, ...entry } = await cashFlowImportDb.getById(id);
        await db
            .update(cashFlowImport)
            .set({
                ...entry,
                importedAt: new Date(),
            })
            .where(eq(cashFlowImport.id, id));
    },
    async getAll(): Promise<CashFlowImportRead[]> {
        const cashFlowImports = await db
            .select({
                id: cashFlowImport.id,
                createdAt: cashFlowImport.createdAt,
                importedAt: cashFlowImport.importedAt,
                fileBase64: cashFlowImport.fileBase64,
                fileName: cashFlowImport.fileName,
            })
            .from(cashFlowImport);
        return cashFlowImports.map((cfi) => ({
            id: cfi.id,
            createdAt: cfi.createdAt,
            importedAt: cfi.importedAt,
            fileName: cfi.fileName,
            fileSizeInKB: ((cfi.fileBase64.length * 3) / 4 / 1024).toFixed(2),
        }));
    },
};
