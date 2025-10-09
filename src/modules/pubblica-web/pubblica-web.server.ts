import { serverEnv } from "@/env/server-env";
import { PubblicaWebApi } from "./pubblica-web-api-client";
import { pubblicaWebUtils } from "./pubblica-web.utils";
import { db } from "@/drizzle/drizzle-db";
import {
  documents,
  pubblicaWebMonthlyBalances,
  pubblicaWebPayslips,
  pubblicaWebPayslipSourceFiles,
} from "@/drizzle/schema";
import { CreatePubblicaWebMonthlyBalanceDto } from "./schemas/pubblica-web.create.schema";
import { eq, desc, isNull } from "drizzle-orm";
import { createHash } from "crypto";

export const pubblicaWebServer = {
  async storeMonthlyBalanceByYearAndMonth({
    year,
    month,
  }: CreatePubblicaWebMonthlyBalanceDto) {
    const client = new PubblicaWebApi(
      serverEnv.pubblicaWebUsername,
      serverEnv.pubblicaWebPassword,
    );

    await client.authenticate();

    const monthlyBalance = await client.fetchMonthlyBalance(year, month);

    if (!monthlyBalance) {
      throw new Error("No monthly balance found");
    }

    const buffer = new Uint8Array(monthlyBalance!.bytes).buffer;

    const content = Buffer.from(monthlyBalance.bytes);
    const doc = await db
      .insert(documents)
      .values({
        content,
        sizeInBytes: content.byteLength,
        sha256: createHash("sha256").update(content).digest("hex"),
        mime: monthlyBalance.mimeType,
        fileName: monthlyBalance.name,
        extension: monthlyBalance.name.split(".").pop(),
      })
      .returning();

    await db.insert(pubblicaWebMonthlyBalances).values({
      year,
      month,
      total: 0,
      documentId: doc[0].id,
    });
  },
  async storeCurrentMonthMonthlyBalance() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return this.storeMonthlyBalanceByYearAndMonth({ year, month });
  },
  async storeMissingMonthlyBalancesSince2021() {
    const existingBalances = await db
      .select({
        year: pubblicaWebMonthlyBalances.year,
        month: pubblicaWebMonthlyBalances.month,
      })
      .from(pubblicaWebMonthlyBalances);

    const existingBalancesSet = new Set(
      existingBalances.map((b) => `${b.year}-${b.month}`),
    );

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (let year = 2021; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        if (year === currentYear && month > currentMonth) {
          break;
        }

        const key = `${year}-${month}`;
        if (!existingBalancesSet.has(key)) {
          console.log(`Storing missing monthly balance for ${key}`);
          try {
            await this.storeMonthlyBalanceByYearAndMonth({ year, month });
          } catch (error) {
            console.error(
              `Failed to store monthly balance for ${key}:`,
              (error as Error).message,
            );
          }
        }
      }
    }
  },
  async storePayslipsSourceFileByYearAndMonth({
    year,
    month,
  }: CreatePubblicaWebMonthlyBalanceDto) {
    const client = new PubblicaWebApi(
      serverEnv.pubblicaWebUsername,
      serverEnv.pubblicaWebPassword,
    );

    await client.authenticate();

    const payslips = await client.fetchPayslips(year, month);

    console.log(`Fetched payslips for ${year}-${month}: ${payslips.name}`);

    const content = Buffer.from(payslips.bytes);
    const doc = await db
      .insert(documents)
      .values({
        content,
        sizeInBytes: content.byteLength,
        sha256: createHash("sha256").update(content).digest("hex"),
        mime: payslips.mimeType,
        fileName: payslips.name,
        extension: payslips.name.split(".").pop(),
      })
      .returning();

    const result = await db
      .insert(pubblicaWebPayslipSourceFiles)
      .values({
        year,
        month,
        documentId: doc[0].id,
        importedAt: null,
      })
      .returning();

    if (result.length === 0) {
      throw new Error("Failed to insert payslip source file");
    }
  },

  async storeCurrentMonthPayslipsSourceFile() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return this.storePayslipsSourceFileByYearAndMonth({ year, month });
  },
  async parseAndStorePayslipsSourceFile(sourceFileId: number) {
    const sourceFileResult = await db
      .select({
        id: pubblicaWebPayslipSourceFiles.id,
        documentId: pubblicaWebPayslipSourceFiles.documentId,
        year: pubblicaWebPayslipSourceFiles.year,
        month: pubblicaWebPayslipSourceFiles.month,
      })
      .from(pubblicaWebPayslipSourceFiles)
      .where(eq(pubblicaWebPayslipSourceFiles.id, sourceFileId))
      .limit(1);

    if (!sourceFileResult || sourceFileResult.length === 0) {
      throw new Error(`Source file with ID ${sourceFileId} not found`);
    }
    const sourceDoc = await db
      .select({
        content: documents.content,
        mime: documents.mime,
        fileName: documents.fileName,
        extension: documents.extension,
      })
      .from(documents)
      .where(eq(documents.id, sourceFileResult[0].documentId!))
      .limit(1);
    if (!sourceDoc.length) {
      throw new Error("Document not found for source file");
    }
    const payslipsBuffer = new Uint8Array(sourceDoc[0].content).buffer;

    const parsedPayslips =
      await pubblicaWebUtils.parseMultiPageSalaries(payslipsBuffer);

    await db.transaction(async (tx) => {
      for (const payslip of parsedPayslips) {
        // store a document for each payslip
        const content = payslip.buffer;
        const doc = await tx
          .insert(documents)
          .values({
            content,
            sizeInBytes: content.byteLength,
            sha256: createHash("sha256").update(content).digest("hex"),
            mime: sourceDoc[0].mime,
            fileName: sourceDoc[0].fileName,
            extension: sourceDoc[0].extension,
          })
          .returning();

        await tx.insert(pubblicaWebPayslips).values({
          year: sourceFileResult[0].year,
          month: sourceFileResult[0].month,
          fullName: payslip.fullName,
          cf: payslip.cf,
          birthDate: `${String(payslip.birthDate.getDate()).padStart(2, "0")}/${String(payslip.birthDate.getMonth() + 1).padStart(2, "0")}/${payslip.birthDate.getFullYear()}`,
          hireDate: `${String(payslip.hireDate.getDate()).padStart(2, "0")}/${String(payslip.hireDate.getMonth() + 1).padStart(2, "0")}/${payslip.hireDate.getFullYear()}`,
          gross: payslip.gross,
          net: payslip.net,
          workedDays: payslip.workedDays,
          workedHours: payslip.workedHours,
          permissionsHoursBalance: payslip.permissionsHoursBalance,
          holidaysHoursBalance: payslip.holidaysHoursBalance,
          rolHoursBalance: payslip.rolHoursBalance,
          payrollRegistrationNumber: payslip.payrollRegistrationNumber,
          documentId: doc[0].id,
        });
      }

      await tx
        .update(pubblicaWebPayslipSourceFiles)
        .set({ importedAt: new Date() })
        .where(eq(pubblicaWebPayslipSourceFiles.id, sourceFileId));
    });
  },

  async parseAllPayslipSourceFiles() {
    const existingFiles = await db
      .select({
        year: pubblicaWebPayslipSourceFiles.year,
        month: pubblicaWebPayslipSourceFiles.month,
      })
      .from(pubblicaWebPayslipSourceFiles);
  },

  // TODO: one shot, drop after running once
  async storePayslipsSourceFileSince2021() {
    const existingFiles = await db
      .select({
        year: pubblicaWebPayslipSourceFiles.year,
        month: pubblicaWebPayslipSourceFiles.month,
      })
      .from(pubblicaWebPayslipSourceFiles);
    const existingFilesSet = new Set(
      existingFiles.map((f) => `${f.year}-${f.month}`),
    );

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (let year = 2021; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        if (year === currentYear && month > currentMonth) {
          break;
        }

        const key = `${year}-${month}`;
        if (!existingFilesSet.has(key)) {
          console.log(`Storing missing payslip source file for ${key}`);
          try {
            await this.storePayslipsSourceFileByYearAndMonth({ year, month });
          } catch (error) {
            console.error(
              `Failed to store payslip source file for ${key}:`,
              (error as Error).message,
            );
          }
        }
      }
    }
  },

  async parseAndStoreAllUnimportedPayslipsSourceFiles() {
    const unimportedFiles = await db
      .select({
        id: pubblicaWebPayslipSourceFiles.id,
      })
      .from(pubblicaWebPayslipSourceFiles)
      .where(isNull(pubblicaWebPayslipSourceFiles.importedAt))
      .orderBy(
        desc(pubblicaWebPayslipSourceFiles.year),
        desc(pubblicaWebPayslipSourceFiles.month),
      );

    for (const file of unimportedFiles) {
      console.log(
        `Parsing and storing payslips from source file ID ${file.id}`,
      );
      await this.parseAndStorePayslipsSourceFile(file.id);
    }
  },

  async parseAllUnparsedMonthlyBalances() {
    // all unparsed monthly balances have total = 0
    const unparsedBalances = await db
      .select({
        id: pubblicaWebMonthlyBalances.id,
        year: pubblicaWebMonthlyBalances.year,
        month: pubblicaWebMonthlyBalances.month,
        documentId: pubblicaWebMonthlyBalances.documentId,
      })
      .from(pubblicaWebMonthlyBalances)
      .where(eq(pubblicaWebMonthlyBalances.total, 0))
      .orderBy(
        desc(pubblicaWebMonthlyBalances.year),
        desc(pubblicaWebMonthlyBalances.month),
      );

    for (const balance of unparsedBalances) {
      console.log(
        `Parsing and updating monthly balance for ${balance.year}-${balance.month}`,
      );
      try {
        const doc = await db
          .select({ content: documents.content })
          .from(documents)
          .where(eq(documents.id, balance.documentId!))
          .limit(1);
        if (!doc.length) {
          console.error(
            `Document not found for monthly balance ID ${balance.id}`,
          );
          continue;
        }
        const buffer = new Uint8Array(doc[0].content).buffer;
        const parsedMonthlyBalance =
          await pubblicaWebUtils.parseSalaryMonthlyBalance(buffer);
        await db
          .update(pubblicaWebMonthlyBalances)
          .set({ total: parsedMonthlyBalance.totalBusinessCost })
          .where(eq(pubblicaWebMonthlyBalances.id, balance.id));
      } catch (error) {
        console.error(
          `Failed to parse and update monthly balance ID ${balance.id}:`,
          (error as Error).message,
        );
      }
    }
  },

  async getAllPayslipSourceFiles() {
    return db
      .select()
      .from(pubblicaWebPayslipSourceFiles)
      .orderBy(
        desc(pubblicaWebPayslipSourceFiles.year),
        desc(pubblicaWebPayslipSourceFiles.month),
      );
  },
};
