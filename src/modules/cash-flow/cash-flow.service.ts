import { db } from "@/drizzle/drizzle-db";
import { bankStatementUtils } from "./bank-statement.utils";
import { BankStatementRead, Transaction } from "./schemas/bank-statement-read";
import { cashFlowImport } from "@/drizzle/schema";
import { CashFlowImportRead } from "./schemas/cash-flow-import-read";
import { eq } from "drizzle-orm";
import { CashFlowImportReadExtended } from "./schemas/cash-flow-import-read-extended";
import { firstOrThrow } from "@/utils/array-utils";

export const cashFlowService = {
  async parseBankStatementXlsx(bytes: Buffer): Promise<BankStatementRead> {
    const parsedDataValues = bankStatementUtils.parseBancaIntesaXslx(bytes);

    // account number row has only 2 columns, the label and the value
    const accountNumber =
      bankStatementUtils.getAccountNumberFromBankStatementOrThrow(
        parsedDataValues
      );

    const openingBalance =
      bankStatementUtils.getOpeningBalanceFromBankStatementOrThrow(
        parsedDataValues
      );

    const closingBalance =
      bankStatementUtils.getClosingBalanceFromBankStatementOrThrow(
        parsedDataValues
      );

    const firstRowWithTransactions =
      bankStatementUtils.getFirstRowWithTransactionsOrThrow(parsedDataValues);

    const lastRowWithTransations =
      bankStatementUtils.getLastRowWithTransactionsOrThrow(parsedDataValues);

    const transactionsCells = parsedDataValues.slice(
      firstRowWithTransactions,
      lastRowWithTransations + 1
    );

    const transactions: Transaction[] = [];

    for (const row of transactionsCells) {
      transactions.push(bankStatementUtils.parseTransactionRowOrThrow(row));
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

  async getCashFlowImports(): Promise<CashFlowImportRead[]> {
    const cashFlowImports = await db
      .select({
        id: cashFlowImport.id,
        createdAt: cashFlowImport.createdAt,
        importedAt: cashFlowImport.importedAt,
        fileBase64: cashFlowImport.fileBase64,
        fileName: cashFlowImport.fileName,
      })
      .from(cashFlowImport);
    return cashFlowImports.map((cashFlowImport) => ({
      id: cashFlowImport.id,
      createdAt: cashFlowImport.createdAt,
      importedAt: cashFlowImport.importedAt,
      fileName: cashFlowImport.fileName,
      fileSizeInKB: ((cashFlowImport.fileBase64.length * 3) / 4 / 1024).toFixed(
        2
      ),
    }));
  },

  async deleteCashFlowImport(id: number): Promise<void> {
    await db.delete(cashFlowImport).where(eq(cashFlowImport.id, id));
  },
  async getCashFlowImportExtended(
    id: number
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
      fileSizeInKB: ((record.fileBase64.length * 3) / 4 / 1024).toFixed(2),
    };
  },
};
