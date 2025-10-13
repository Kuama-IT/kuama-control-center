import { db } from "@/drizzle/drizzle-db";
import { payslips, pubblicaWebPayslips } from "@/drizzle/schema";
import { PubblicaWebEmployeeMonthlyCost } from "@/modules/pubblica-web/schemas/pubblica-web-employee-monthly-cost-read";
import { PubblicaWebPayslipRead } from "@/modules/pubblica-web/schemas/pubblica-web-payslip-read";
import { format, parse } from "date-fns";
import { desc, eq, isNull, or, gt } from "drizzle-orm";
import { employeesDb } from "../employees/employees.db";
import { pubblicaWebDb } from "../pubblica-web/pubblica-web.db";
import { pubblicaWebUtils } from "../pubblica-web/pubblica-web.utils";
import { payslipsDb } from "./payslips.db";
import { firstOrThrow } from "@/utils/array-utils";

export const payslipsServer = {
  /**
   * get all payslips in pubblica web where their document id is not present inside payslips table
   * for each record, ensure to populate both employee table with possible missing data and payslips table
   * WARNING: this method should be invoked AFTER populating the employees table, since payslip has a reference on employee
   */
  async importFromPubblicaWebPayslips() {
    const missingPayslips = await db
      .select({
        // List all columns from pubblicaWebPayslips you want to select
        id: pubblicaWebPayslips.id,
        fullName: pubblicaWebPayslips.fullName,
        year: pubblicaWebPayslips.year,
        month: pubblicaWebPayslips.month,
        birthDate: pubblicaWebPayslips.birthDate,
        hireDate: pubblicaWebPayslips.hireDate,
        cf: pubblicaWebPayslips.cf,
        createdAt: pubblicaWebPayslips.createdAt,
        updatedAt: pubblicaWebPayslips.updatedAt,
        net: pubblicaWebPayslips.net,
        gross: pubblicaWebPayslips.gross,
        workedDays: pubblicaWebPayslips.workedDays,
        workedHours: pubblicaWebPayslips.workedHours,
        permissionsHoursBalance: pubblicaWebPayslips.permissionsHoursBalance,
        holidaysHoursBalance: pubblicaWebPayslips.holidaysHoursBalance,
        rolHoursBalance: pubblicaWebPayslips.rolHoursBalance,
        payrollRegistrationNumber:
          pubblicaWebPayslips.payrollRegistrationNumber,
        documentId: pubblicaWebPayslips.documentId,
      })
      .from(pubblicaWebPayslips)
      .leftJoin(
        payslips,
        eq(pubblicaWebPayslips.documentId, payslips.documentId),
      )
      .where(
        or(
          isNull(payslips.id),
          gt(pubblicaWebPayslips.updatedAt, payslips.updatedAt),
        ),
      )
      .orderBy(desc(pubblicaWebPayslips.year), desc(pubblicaWebPayslips.month));

    // for each month and year, compute employer cost

    // group missing payslips by year and month
    const payslipsByYearAndMonth = new Map<string, PubblicaWebPayslipRead[]>();
    for (const missing of missingPayslips) {
      const key = `${missing.year}_${missing.month}`;
      if (!payslipsByYearAndMonth.has(key)) {
        payslipsByYearAndMonth.set(key, []);
      }
      payslipsByYearAndMonth.get(key)?.push(missing);
    }

    // key will be year_month_full_name
    const employerCostByYearAndMonth = new Map<
      string,
      PubblicaWebEmployeeMonthlyCost
    >();
    for (const entry of payslipsByYearAndMonth.entries()) {
      const [key, missingPayslipsByYearAndMonth] = entry;

      const [year, month] = key.split("_").map(Number);
      // get total business cost in missing year and month
      const monthlyBalance =
        await pubblicaWebDb.getMonthlyBalanceByYearAndMonth(year, month);
      if (!monthlyBalance) {
        throw new Error(
          `Monthly balance for year ${year} and month ${month} not found. Did you import monthly balances?`,
        );
      }

      const monthlyCosts = pubblicaWebUtils.computeEmployeesMonthlyCost(
        missingPayslipsByYearAndMonth,
        monthlyBalance.total,
      );
      for (const monthlyCost of monthlyCosts) {
        const employeeKey = monthlyCost.fullName
          .toLowerCase()
          .replace(/\s/g, "_");
        employerCostByYearAndMonth.set(
          `${year}_${month}_${employeeKey}`,
          monthlyCost,
        );
      }
    }

    for (const missing of missingPayslips) {
      // create payslip record and update related employee infos
      const employee = await employeesDb.findByFullName(missing.fullName);

      if (!employee) {
        console.warn(
          `Employee with full name ${missing.fullName} not found. Did you import employees?`,
        );
        continue;
      }
      const employeeKey = missing.fullName.toLowerCase().replace(/\s/g, "_");
      const key = `${missing.year}_${missing.month}_${employeeKey}`;
      const employerCost = employerCostByYearAndMonth.get(key);

      if (!employerCost) {
        throw new Error(
          `Missing employer cost for ${missing.fullName} in ${missing.month}/${missing.year}`,
        );
      }

      await payslipsDb
        .create({
          employeeId: employee.id,
          year: missing.year,
          month: missing.month,
          gross: missing.gross,
          net: missing.net,
          businessCost: employerCost.businessCost,
          oneri: employerCost.oneri,
          quota: employerCost.quota,
          documentId: missing.documentId,
          workedDays: missing.workedDays,
          workedHours: missing.workedHours,
          permissionsHoursBalance: missing.permissionsHoursBalance,
          holidaysHoursBalance: missing.holidaysHoursBalance,
          rolHoursBalance: missing.rolHoursBalance,
          payrollRegistrationNumber: missing.payrollRegistrationNumber,
        })
        .onConflictDoUpdate({
          target: [payslips.employeeId, payslips.month, payslips.year],
          set: {
            employeeId: employee.id,
            year: missing.year,
            month: missing.month,
            gross: missing.gross,
            net: missing.net,
            businessCost: employerCost.businessCost,
            oneri: employerCost.oneri,
            quota: employerCost.quota,
            workedDays: missing.workedDays,
            workedHours: missing.workedHours,
            permissionsHoursBalance: missing.permissionsHoursBalance,
            holidaysHoursBalance: missing.holidaysHoursBalance,
            rolHoursBalance: missing.rolHoursBalance,
            payrollRegistrationNumber: missing.payrollRegistrationNumber,
          },
        });

      // update employee data: what is on payslip is always correct, no matter what.
      await employeesDb.update({
        ...employee,
        hiredOn: format(
          parse(missing.hireDate, "dd/MM/yyyy", new Date()),
          "yyyy-MM-dd",
        ),
        payrollRegistrationNumber: missing.payrollRegistrationNumber,
        cf: missing.cf,
        birthdate: format(
          parse(missing.birthDate, "dd/MM/yyyy", new Date()),
          "yyyy-MM-dd",
        ),
      });
    }
  },

  async getLatestByEmployeeId(employeeId: number) {
    const res = await db
      .select()
      .from(payslips)
      .where(eq(payslips.employeeId, employeeId))
      .orderBy(desc(payslips.year), desc(payslips.month))
      .limit(1);

    return firstOrThrow(res);
  },
};
