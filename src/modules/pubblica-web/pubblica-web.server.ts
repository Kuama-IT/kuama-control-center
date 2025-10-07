import { serverEnv } from "@/env/server-env";
import { PubblicaWebApi } from "./pubblica-web-api-client";
import { pubblicaWebUtils } from "./pubblica-web.utils";
import { db } from "@/drizzle/drizzle-db";
import {
  pubblicaWebMonthlyBalances,
  pubblicaWebPayslips,
  pubblicaWebPayslipSourceFiles,
} from "@/drizzle/schema";
import { CreatePubblicaWebMonthlyBalanceDto } from "./schemas/pubblica-web.create.schema";
import { eq, desc, isNull } from "drizzle-orm";

export const pubblicaWebServer = {
  async storeMonthlyBalanceByYearAndMonth({
    year,
    month,
  }: CreatePubblicaWebMonthlyBalanceDto) {
    const client = new PubblicaWebApi(
      serverEnv.pubblicaWebUsername,
      serverEnv.pubblicaWebPassword
    );

    await client.authenticate();

    const monthlyBalance = await client.fetchMonthlyBalance(year, month);

    if (!monthlyBalance) {
      throw new Error("No monthly balance found");
    }

    const buffer = new Uint8Array(monthlyBalance!.bytes).buffer;
    const parsedMonthlyBalance =
      await pubblicaWebUtils.parseSalaryMonthlyBalance(buffer);

    await db.insert(pubblicaWebMonthlyBalances).values({
      year,
      month,
      total: parsedMonthlyBalance.totalBusinessCost,
      fileBuffer: Buffer.from(monthlyBalance.bytes),
    });
  },
  async storeCurrentMonthMonthlyBalance() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return this.storeMonthlyBalanceByYearAndMonth({ year, month });
  },
  async storeMissingMonthlyBalancesSince2019() {
    const existingBalances = await db
      .select({
        year: pubblicaWebMonthlyBalances.year,
        month: pubblicaWebMonthlyBalances.month,
      })
      .from(pubblicaWebMonthlyBalances);

    const existingBalancesSet = new Set(
      existingBalances.map((b) => `${b.year}-${b.month}`)
    );

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (let year = 2019; year <= currentYear; year++) {
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
              (error as Error).message
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
      serverEnv.pubblicaWebPassword
    );

    await client.authenticate();

    const payslips = await client.fetchPayslips(year, month);

    console.log(`Fetched payslips for ${year}-${month}: ${payslips.name}`);

    const result = await db
      .insert(pubblicaWebPayslipSourceFiles)
      .values({
        year,
        month,
        fileBuffer: Buffer.from(payslips.bytes),
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
        fileBuffer: pubblicaWebPayslipSourceFiles.fileBuffer,
        year: pubblicaWebPayslipSourceFiles.year,
        month: pubblicaWebPayslipSourceFiles.month,
      })
      .from(pubblicaWebPayslipSourceFiles)
      .where(eq(pubblicaWebPayslipSourceFiles.id, sourceFileId))
      .limit(1);

    if (
      !sourceFileResult ||
      sourceFileResult.length === 0 ||
      sourceFileResult[0].fileBuffer === null
    ) {
      throw new Error(`Source file with ID ${sourceFileId} not found`);
    }

    const payslipsBuffer = new Uint8Array(sourceFileResult[0].fileBuffer)
      .buffer;

    const parsedPayslips =
      await pubblicaWebUtils.parseMultiPageSalaries(payslipsBuffer);

    const values = parsedPayslips.map((payslip) => ({
      year: sourceFileResult[0].year,
      month: sourceFileResult[0].month,
      fullName: payslip.fullName,
      cf: payslip.cf,
      birthDate: payslip.birthDate.toISOString(),
      hireDate: payslip.hireDate.toISOString(),
      gross: payslip.gross,
      net: payslip.net,
      workedDays: payslip.workedDays,
      workedHours: payslip.workedHours,
      permissionsHoursBalance: payslip.permissionsHoursBalance,
      holidaysHoursBalance: payslip.holidaysHoursBalance,
      rolHoursBalance: payslip.rolHoursBalance,
      sourceFileId: sourceFileResult[0].id,
    }));

    await db.transaction(async (tx) => {
      await tx.insert(pubblicaWebPayslips).values(values);

      await tx
        .update(pubblicaWebPayslipSourceFiles)
        .set({ importedAt: new Date() })
        .where(eq(pubblicaWebPayslipSourceFiles.id, sourceFileId));
    });
  },

  async storePayslipsSourceFileSince2019() {
    const existingFiles = await db
      .select({
        year: pubblicaWebPayslipSourceFiles.year,
        month: pubblicaWebPayslipSourceFiles.month,
      })
      .from(pubblicaWebPayslipSourceFiles);
    const existingFilesSet = new Set(
      existingFiles.map((f) => `${f.year}-${f.month}`)
    );

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (let year = 2019; year <= currentYear; year++) {
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
              (error as Error).message
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
        desc(pubblicaWebPayslipSourceFiles.month)
      );

    for (const file of unimportedFiles) {
      console.log(
        `Parsing and storing payslips from source file ID ${file.id}`
      );
      try {
        await this.parseAndStorePayslipsSourceFile(file.id);
      } catch (error) {
        console.error(
          `Failed to parse and store payslips from source file ID ${file.id}:`,
          (error as Error).message
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
        desc(pubblicaWebPayslipSourceFiles.month)
      );
  },
};
