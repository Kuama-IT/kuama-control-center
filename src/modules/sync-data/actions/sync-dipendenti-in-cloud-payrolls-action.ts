"use server";
import { getSalaryHistoryWithGrossAmounts } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-utils";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees, kPayrolls } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";

export default handleServerErrors(async (years: number[]) => {
  const history = await getSalaryHistoryWithGrossAmounts(
    dipendentiInCloudApiClient,
    years,
  );

  await db.transaction(async (tx) => {
    for (const employeeSalaryHistory of history) {
      console.log(
        `********** Syncing ${employeeSalaryHistory.employeeName} salary history **********`,
      );

      const kEmployeeRecords = await db
        .select()
        .from(kEmployees)
        .where(
          eq(
            kEmployees.dipendentiInCloudId,
            employeeSalaryHistory.employeeId.toString(),
          ),
        );
      const kEmployee = firstOrThrow(kEmployeeRecords);

      for (const [year, salaries] of Object.entries(
        employeeSalaryHistory.salaries,
      )) {
        console.log(`***** ${year} *****`);
        for (const salary of salaries) {
          console.log(`***** ${salary.date} *****`);
          const data: typeof kPayrolls.$inferInsert = {
            employeeId: kEmployee.id,
            net: salary.net,
            gross: salary.gross,
            date: salary.date,
            url: salary.url,
            dipendentiInCloudPayrollId:
              salary.dipendentiInCloudPayrollId.toString(),
            // Copilot proposes also:
            // month: salary.month,
            // gross: salary.gross,
            // net: salary.net,
            // tax: salary.tax,
            // inps: salary.inps,
            // inail: salary.inail,
            // irpef: salary.irpef,
            // lordo: salary.lordo,
            // netto: salary.netto,
            // tfr: salary.tfr,
            // contributi: salary.contributi,
            // other: salary.other,
            // bonus: salary.bonus,
            // ral: salary.ral,
            // ralNet: salary.ralNet,
            // ralTax: salary.ralTax,
            // ralInps: salary.ralInps,
            // ralInail: salary.ralInail,
            // ralIrpef: salary.ralIrpef,
            // ralLordo: salary.ralLordo,
            // ralNetto: salary.ralNetto,
            // ralTfr: salary.ralTfr,
            // ralContributi: salary.ralContributi,
            // ralOther: salary.ralOther,
            // ralBonus: salary.ralBonus,
          };
          await db.insert(kPayrolls).values(data).onConflictDoNothing();
        }
      }
    }
  });
});
