import { db } from "@/drizzle/drizzle-db";
import { payslips, pubblicaWebPayslips } from "@/drizzle/schema";
import { desc, inArray, isNull, not } from "drizzle-orm";
import { employeesDb } from "../employees/employees.db";
import { pubblicaWebDb } from "../pubblica-web/pubblica-web.db";
import { pubblicaWebUtils } from "../pubblica-web/pubblica-web.utils";
import { payslipsDb } from "./payslips.db";

export const payslipsServer = {
  async importFromPubblicaWebPayslips() {
    // get all payslips in pubblica web where their document id is not present inside payslips table
    // for each record, ensure to populate both employee table with possible missing data and payslips table
    // WARNING: this method should be invoked AFTER populating the employees table, since payslip has a reference on employee

    const missingPayslips = await db
      .select()
      .from(pubblicaWebPayslips)
      .where(
        not(
          inArray(
            pubblicaWebPayslips.documentId,
            db
              .select({ documentId: payslips.documentId })
              .from(payslips)
              .where(not(isNull(payslips.documentId)))
          )
        )
      )
      .orderBy(desc(pubblicaWebPayslips.year), desc(pubblicaWebPayslips.month));

    for (const missing of missingPayslips) {
      // create payslip record and update related employee infos
      const employee = await employeesDb.findByFullName(missing.fullName);

      if (!employee) {
        throw new Error(
          `Employee with full name ${missing.fullName} not found. Did you import employees?`
        );
      }

      // get total business cost in missing year and month
      const monthlyBalance =
        await pubblicaWebDb.getMonthlyBalanceByYearAndMonth(
          missing.year,
          missing.month
        );
      if (!monthlyBalance) {
        throw new Error(
          `Monthly balance for year ${missing.year} and month ${missing.month} not found. Did you import monthly balances?`
        );
      }

      const [employerCost] = pubblicaWebUtils.computeEmployeesMonthlyCost(
        [missing],
        monthlyBalance.total
      );

      await payslipsDb.create({
        employeeId: employee.id,
        year: missing.year,
        month: missing.month,
        gross: missing.gross,
        net: missing.net,
        employerCost: employerCost.businessCost,
        documentId: missing.documentId,
      });

      // update employee data: what is on payslip is always correct, no matter what.
      await employeesDb.update({
        ...employee,
        hiredOn: missing.hireDate,
        // payrollRegistrationNumber TODO: read payroll number from PDF,
        cf: missing.cf,
        birthdate: missing.birthDate,
      });
    }
  },
};
