import { db } from "@/drizzle/drizzle-db";
import { kEmployees, kPayrolls, pubblicaWebPayrolls } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { parse, differenceInYears } from "date-fns";

export type EmployeeWithPayrolls = kEmployees.$inferSelect & {
  payrolls: Array<pubblicaWebPayrolls.$inferSelect>;
  age: number | null;
  averagePayroll: number;
  yearsWithCompany: number | null;
};

export const employeesService = {
  async allWithPayrolls() {
    const res = await db.select().from(kEmployees);

    const data: Array<EmployeeWithPayrolls> = [];
    for (const employee of res) {
      const payrolls = await db
        .select()
        .from(pubblicaWebPayrolls)
        .where(
          eq(
            pubblicaWebPayrolls.employeeName,
            `${employee.fullName?.toUpperCase()}`
          )
        )
        .orderBy(
          desc(pubblicaWebPayrolls.year),
          desc(pubblicaWebPayrolls.month)
        );
      employee.birthdate = payrolls[0]?.birthDate || null;

      const age = employee.birthdate ? calculateAge(employee.birthdate) : null;
      const averagePayroll = calculateAveragePayroll(payrolls);

      // compute how many years has the employee been with the company
      const yearsWithCompany = employee.hiredOn
        ? new Date().getFullYear() - new Date(employee.hiredOn).getFullYear()
        : null;
      data.push({
        ...employee,
        payrolls,
        age,
        averagePayroll,
        yearsWithCompany,
      });
    }
    return data;
  },
};

const calculateAge = (birthdate: string | null): number | null => {
  if (!birthdate) return null;
  try {
    // Parse birthdate in DD/MM/YYYY format (e.g., "30/05/1998")
    const birth = parse(birthdate, "dd/MM/yyyy", new Date());
    const today = new Date();
    return differenceInYears(today, birth);
  } catch (error) {
    console.error(`Failed to parse birthdate: ${birthdate}`, error);
    return null;
  }
};

const calculateAveragePayroll = (payrolls: Array<{ net: number }>): number => {
  if (payrolls.length === 0) return 0;
  const total = payrolls.reduce((sum, payroll) => sum + payroll.net, 0);
  return total / payrolls.length;
};
