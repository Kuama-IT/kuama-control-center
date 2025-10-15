import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { cashFlowEntry, cashFlowImport } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";
import { bankStatementUtils } from "./bank-statement.utils";
import {
    type BankStatementRead,
    type Transaction,
} from "./schemas/bank-statement-read";
import { type CashFlowEntryRead } from "./schemas/cash-flow-entry-read";
import { type CashFlowImportReadExtended } from "./schemas/cash-flow-import-read-extended";

export const cashFlowService = {
    async parseBankStatementXlsx(bytes: Buffer): Promise<BankStatementRead> {
        const parsedDataValues = bankStatementUtils.parseBancaIntesaXslx(bytes);

        // account number row has only 2 columns, the label and the value
        const accountNumber =
            bankStatementUtils.getAccountNumberFromBankStatementOrThrow(
                parsedDataValues,
            );

        const openingBalance =
            bankStatementUtils.getOpeningBalanceFromBankStatementOrThrow(
                parsedDataValues,
            );

        const closingBalance =
            bankStatementUtils.getClosingBalanceFromBankStatementOrThrow(
                parsedDataValues,
            );

        const firstRowWithTransactions =
            bankStatementUtils.getFirstRowWithTransactionsOrThrow(
                parsedDataValues,
            );

        const lastRowWithTransations =
            bankStatementUtils.getLastRowWithTransactionsOrThrow(
                parsedDataValues,
            );

        const transactionsCells = parsedDataValues.slice(
            firstRowWithTransactions,
            lastRowWithTransations + 1,
        );

        const transactions: Transaction[] = [];

        for (const row of transactionsCells) {
            transactions.push(
                bankStatementUtils.parseTransactionRowOrThrow(row),
            );
        }

        return {
            accountNumber,
            openingBalance,
            closingBalance,
            transactions,
        };
    },

    async saveBankStatement(buffer: Buffer, fileName: string): Promise<void> {
        await db.insert(cashFlowImport).values({
            fileBase64: buffer.toString("base64"),
            fileName,
        });
    },

    async deleteCashFlowImport(id: number): Promise<void> {
        await db.delete(cashFlowImport).where(eq(cashFlowImport.id, id));
    },
    async getCashFlowImportExtended(
        id: number,
    ): Promise<CashFlowImportReadExtended> {
        const result = await db
            .select({
                id: cashFlowImport.id,
                fileBase64: cashFlowImport.fileBase64,
                fileName: cashFlowImport.fileName,
                importedAt: cashFlowImport.importedAt,
                createdAt: cashFlowImport.createdAt,
            })
            .from(cashFlowImport)
            .where(eq(cashFlowImport.id, id));

        const record = firstOrThrow(result);

        return {
            ...record,
            fileSizeInKB: ((record.fileBase64.length * 3) / 4 / 1024).toFixed(
                2,
            ),
        };
    },

    async getCashFlowEntriesByDateRange(
        startDate: Date,
        endDate: Date,
    ): Promise<CashFlowEntryRead[]> {
        return await db
            .select({
                id: cashFlowEntry.id,
                date: cashFlowEntry.date,
                amount: cashFlowEntry.amount,
                description: cashFlowEntry.description,
                extendedDescription: cashFlowEntry.extendedDescription,
                isIncome: cashFlowEntry.isIncome,
                categoryId: cashFlowEntry.categoryId,
            })
            .from(cashFlowEntry)
            .where(
                and(
                    gte(cashFlowEntry.date, startDate),
                    lte(cashFlowEntry.date, endDate),
                ),
            )
            .orderBy(cashFlowEntry.date);
    },

    async createCashFlowEntries(
        entries: {
            date: Date;
            amount: number;
            description: string;
            extendedDescription: string;
            categoryId: number;
            isIncome: boolean;
            externalId?: string;
        }[],
    ): Promise<{ created: number; skipped: number }> {
        if (entries.length === 0) return { created: 0, skipped: 0 };

        const result = await db
            .insert(cashFlowEntry)
            .values(entries)
            .onConflictDoNothing({
                target: [
                    cashFlowEntry.date,
                    cashFlowEntry.amount,
                    cashFlowEntry.description,
                    cashFlowEntry.extendedDescription,
                ],
            })
            .returning({ id: cashFlowEntry.id });

        return {
            created: result.length,
            skipped: entries.length - result.length,
        };
    },

    async createCashFlowEntriesFromTransactions(
        transactions: Transaction[],
        categoryMap: Map<number, number>,
    ): Promise<{ created: number; skipped: number }> {
        const entries = transactions
            .map((transaction, index) => {
                const categoryId = categoryMap.get(index);
                if (!categoryId) return null;

                return {
                    date: transaction.date,
                    amount: Math.abs(transaction.amount),
                    description: transaction.description,
                    extendedDescription: transaction.extendedDescription,
                    categoryId,
                    isIncome: transaction.amount > 0,
                    externalId: `import_${Date.now()}_${index}`,
                };
            })
            .filter(
                (entry): entry is NonNullable<typeof entry> => entry !== null,
            );

        return await this.createCashFlowEntries(entries);
    },
};
