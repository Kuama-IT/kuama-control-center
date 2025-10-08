"use server";

import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import { serverEnv } from "@/env/server-env";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import {
  pubblicaWebMonthlyBalances,
  pubblicaWebPayslips,
} from "@/drizzle/schema";
import { desc, eq, or } from "drizzle-orm";
import { pubblicaWebUtils } from "../pubblica-web.utils";

const formatItalianDate = (d: Date): string => {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const handledSyncEmployeePayrolls = handleServerErrors(async function ({
  year,
}: {
  year: string;
}) {
  // clear existing payrolls for the year
  await db
    .delete(pubblicaWebPayslips)
    .where(eq(pubblicaWebPayslips.year, parseInt(year)));

  const pubblicaWebClient = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword
  );

  await pubblicaWebClient.authenticate();

  // fetch all monthly payslips for the year
  for (let month = 1; month < 14; month++) {
    await downloadAndUpsertEmployeePayrollsByYearAndMonth(
      year,
      month,
      pubblicaWebClient
    );
  }
});

export const handledSynccurrentMonthEmployeePayrolls = handleServerErrors(
  async function () {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.getMonth() + 1;

    // TODO handle 13esima in December

    const pubblicaWebClient = new PubblicaWebApi(
      serverEnv.pubblicaWebUsername,
      serverEnv.pubblicaWebPassword
    );

    await pubblicaWebClient.authenticate();

    await downloadAndUpsertEmployeePayrollsByYearAndMonth(
      year,
      month,
      pubblicaWebClient
    );
  }
);

const downloadAndUpsertEmployeePayrollsByYearAndMonth = async (
  year: string,
  month: number,
  pubblicaWebClient: PubblicaWebApi
) => {
  let payslips: {
    bytes: ArrayBuffer;
    mimeType: string;
    name: string;
  };
  try {
    payslips = await pubblicaWebClient.fetchPayslips(parseInt(year), month);
  } catch (e) {
    console.log(`No payslip found for ${year}/${month}`);
    return;
  }

  console.log(`fetching payslips for ${year}/${month}`);
  const salaryInfos = await pubblicaWebUtils.parseMultiPageSalaries(
    new Uint8Array(payslips.bytes).buffer
  );

  // payslip.name = LUL-2021-01.pdf

  for (const salaryInfo of salaryInfos) {
    console.log(
      `Saving payslip for ${salaryInfo.fullName} - ${year}/${month} - birthdate: ${salaryInfo.birthDate} - net: ${salaryInfo.net} - gross: ${salaryInfo.gross}`
    );
    await db
      .insert(pubblicaWebPayslips)
      .values({
        fullName: salaryInfo.fullName,
        year: parseInt(year),
        month: month,
        net: salaryInfo.net,
        gross: salaryInfo.gross,
        birthDate: formatItalianDate(salaryInfo.birthDate),
        hireDate: formatItalianDate(salaryInfo.hireDate),
        // documentId to be set when documents flow is implemented
      })
      .onConflictDoUpdate({
        target: [
          pubblicaWebPayslips.fullName,
          pubblicaWebPayslips.year,
          pubblicaWebPayslips.month,
        ],
        set: {
          net: salaryInfo.net,
          gross: salaryInfo.gross,
          birthDate: formatItalianDate(salaryInfo.birthDate),
          hireDate: formatItalianDate(salaryInfo.hireDate),
        },
      });
  }
};

export const handledSyncPayslipsMonthlyBalances = handleServerErrors(
  async function ({ year }: { year: string }) {
    await db
      .delete(pubblicaWebMonthlyBalances)
      .where(eq(pubblicaWebMonthlyBalances.year, parseInt(year)));

    const pubblicaWebClient = new PubblicaWebApi(
      serverEnv.pubblicaWebUsername,
      serverEnv.pubblicaWebPassword
    );

    await pubblicaWebClient.authenticate();

    for (let month = 1; month < 13; month++) {
      const balanceDocuments = await pubblicaWebClient.fetchMonthlyBalance(
        parseInt(year),
        month
      );
      if (!balanceDocuments) {
        console.log(`No monthly balance found for ${year}/${month}`);
        continue;
      }

      const balance = await pubblicaWebUtils.parseSalaryMonthlyBalance(
        new Uint8Array(balanceDocuments.bytes).buffer
      );

      console.log(`Saving monthly balance for ${year}/${month}`);
      await db
        .insert(pubblicaWebMonthlyBalances)
        .values({
          year: parseInt(year),
          month: month,
          total: balance.totalBusinessCost,
        })
        .onConflictDoUpdate({
          target: [
            pubblicaWebMonthlyBalances.year,
            pubblicaWebMonthlyBalances.month,
          ],
          set: {
            total: balance.totalBusinessCost,
          },
        });
    }
  }
);

export const handledListRootFolders = handleServerErrors(async function () {
  const pubblicaWebClient = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword
  );

  await pubblicaWebClient.authenticate();

  const folders = await pubblicaWebClient.listRootFolders();
  const filteredFolders = folders.filter((it) => it.text.length === 4);

  // order by employee name
  filteredFolders.sort((a, b) => a.text.localeCompare(b.text));
  const res = [];
  for (const folder of filteredFolders) {
    // fetch associated payrolls
    const payrolls = await db
      .select()
      .from(pubblicaWebPayslips)
      .where(eq(pubblicaWebPayslips.year, parseInt(folder.text)))
      .orderBy(desc(pubblicaWebPayslips.year), desc(pubblicaWebPayslips.month));

    res.push({ ...folder, payrolls });
  }

  return res;
});

export const handledGetPubblicaWebGraphData = handleServerErrors(
  async function () {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // fetch payrolls for the last two years
    const payrolls = await db
      .select()
      .from(pubblicaWebPayslips)
      .where(
        or(
          eq(pubblicaWebPayslips.year, currentYear),
          eq(pubblicaWebPayslips.year, previousYear)
        )
      )
      .orderBy(desc(pubblicaWebPayslips.year), desc(pubblicaWebPayslips.month));

    // aggregate by month
    const dataMap: Record<
      string,
      {
        month: string;
        currentYear: number;
        previousYear: number;
        currentYearEstimate: number;
      }
    > = {};

    for (const payroll of payrolls) {
      const monthKey = String(payroll.month).padStart(2, "0");
      if (!dataMap[monthKey]) {
        dataMap[monthKey] = {
          month: monthKey,
          currentYear: 0,
          previousYear: 0,
          currentYearEstimate: 0,
        };
      }
      if (payroll.year === currentYear) {
        dataMap[monthKey].currentYear += payroll.net;
      } else if (payroll.year === previousYear) {
        dataMap[monthKey].previousYear += payroll.net;
      }
    }

    // handle 13esima. Add it to month 12
    if (dataMap["13"]) {
      if (!dataMap["12"]) {
        dataMap["12"] = {
          month: "12",
          currentYear: 0,
          previousYear: 0,
          currentYearEstimate: 0,
        };
      }

      dataMap["12"].currentYear += dataMap["13"].currentYear;
      dataMap["12"].previousYear += dataMap["13"].previousYear;
      delete dataMap["13"];
    }

    // Find the last month with current year payslips
    let lastMonthWithPayslip = 0;
    for (const payroll of payrolls) {
      if (
        payroll.year === currentYear &&
        payroll.month > lastMonthWithPayslip
      ) {
        lastMonthWithPayslip = payroll.month;
      }
    }

    // Forecast payslips for remaining months
    // Use the last available month's value as forecast for next months
    // For December (month 12), add estimated 13esima
    // Store estimates in a separate field: currentYearEstimate
    if (lastMonthWithPayslip > 0 && lastMonthWithPayslip < 12) {
      // Get the last available month's net
      const lastMonthKey = String(lastMonthWithPayslip).padStart(2, "0");
      const lastMonthNet = dataMap[lastMonthKey]?.currentYear || 0;

      // Fill forecast for months after lastMonthWithPayslip up to December
      for (let m = lastMonthWithPayslip + 1; m <= 12; m++) {
        const key = String(m).padStart(2, "0");
        if (!dataMap[key]) {
          dataMap[key] = {
            month: key,
            currentYear: 0,
            previousYear: 0,
            currentYearEstimate: 0,
          };
        } else if (
          dataMap[key] &&
          dataMap[key].currentYearEstimate === undefined
        ) {
          dataMap[key].currentYearEstimate = 0;
        }

        dataMap[key].currentYearEstimate = lastMonthNet;
      }

      // Estimate 13esima: average of all current year months so far
      let monthsCount = 0;
      let netSum = 0;
      for (let m = 1; m <= 12; m++) {
        const key = String(m).padStart(2, "0");
        if (dataMap[key]?.currentYear) {
          netSum += dataMap[key].currentYear;
          monthsCount++;
        }

        if (dataMap[key]?.currentYearEstimate) {
          netSum += dataMap[key].currentYearEstimate;
          monthsCount++;
        }
      }
      const estimated13esima = monthsCount > 0 ? netSum / monthsCount : 0;
      // For December, add estimated 13esima
      dataMap["12"].currentYearEstimate += estimated13esima;
    }

    const data = Object.values(dataMap);
    // ensure is still sorted by month, ensure net is rounded to 2 decimals
    data.forEach((it) => {
      it.currentYear = parseFloat(it.currentYear.toFixed(2));
      it.previousYear = parseFloat(it.previousYear.toFixed(2));
      it.currentYearEstimate = parseFloat(it.currentYearEstimate.toFixed(2));
    });
    data.sort((a, b) => a.month.localeCompare(b.month));

    return data;
  }
);

export const handledGetPubblicaWebEmployeesCostOverMonthsGraphData =
  handleServerErrors(async function (year: string) {
    const targetYear = parseInt(year);

    // previous year for comparison
    const previousYear = targetYear - 1;

    // fetch payrolls for the year
    const payrolls = await db
      .select()
      .from(pubblicaWebPayslips)
      .where(
        or(
          eq(pubblicaWebPayslips.year, targetYear),
          eq(pubblicaWebPayslips.year, previousYear)
        )
      )
      .orderBy(desc(pubblicaWebPayslips.year), desc(pubblicaWebPayslips.month));

    //  fetch total costs for the year
    const totalCosts = await db
      .select()
      .from(pubblicaWebMonthlyBalances)
      .where(
        or(
          eq(pubblicaWebMonthlyBalances.year, targetYear),
          eq(pubblicaWebMonthlyBalances.year, previousYear)
        )
      )
      .orderBy(
        desc(pubblicaWebMonthlyBalances.year),
        desc(pubblicaWebMonthlyBalances.month)
      );

    // compute cost per employee per month

    const rawData: Array<{
      month: string;
      employeeName: string;
      businessCost: number;
      year: number;
    }> = [];
    for (const cost of totalCosts) {
      const payrollsForMonth = payrolls
        .filter(
          (it) =>
            (it.month === cost.month && it.year === cost.year) ||
            (it.month === 13 && it.year === cost.year) // include 13esima
        )
        .map((it) => ({
          gross: it.gross,
          fullName: it.fullName,
        }));

      const employeesCostsData = pubblicaWebUtils.computeEmployeesMonthlyCost(
        payrollsForMonth,
        cost.total
      );

      rawData.push(
        ...employeesCostsData.map((it) => ({
          month: String(cost.month).padStart(2, "0"),
          employeeName: it.fullName,
          businessCost: it.businessCost,
          year: cost.year,
        }))
      );
    }

    // now we have computed business cost per employee per month for the  target and previous year
    // we need to aggregate by month

    const dataMap: Record<
      string,
      {
        month: string;
        currentYearBusinessCost: number;
        previousYearBusinessCost: number;
      }
    > = {};

    for (const entry of rawData) {
      const monthKey = entry.month;
      if (!dataMap[monthKey]) {
        dataMap[monthKey] = {
          month: monthKey,
          currentYearBusinessCost: 0,
          previousYearBusinessCost: 0,
        };
      }
      if (entry.year === targetYear) {
        dataMap[monthKey].currentYearBusinessCost += entry.businessCost;
      } else if (entry.year === previousYear) {
        dataMap[monthKey].previousYearBusinessCost += entry.businessCost;
      }
    }

    const data = Object.values(dataMap);
    // ensure is still sorted by month, ensure net is rounded to 2 decimals
    data.forEach((it) => {
      it.currentYearBusinessCost = parseFloat(
        it.currentYearBusinessCost.toFixed(2)
      );
      it.previousYearBusinessCost = parseFloat(
        it.previousYearBusinessCost.toFixed(2)
      );
    });
    data.sort((a, b) => a.month.localeCompare(b.month));

    return data;
  });

export type EmployeeCostBalanceGraphData = {
  month: string;
  currentYearBusinessCost: number;
  previousYearBusinessCost: number;
}[];
