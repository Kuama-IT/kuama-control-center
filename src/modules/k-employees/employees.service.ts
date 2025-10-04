import { db } from "@/drizzle/drizzle-db";
import { employees, pubblicaWebPayrolls } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { parse, differenceInYears, isValid } from "date-fns";

export type EmployeeWithPayrolls = Omit<
  typeof employees.$inferSelect,
  "birthdate" | "hiredOn"
> & {
  birthdate: Date | null;
  hiredOn: Date | null;
  payrolls: Array<typeof pubblicaWebPayrolls.$inferSelect>;
  age: number | null;
  averagePayroll: number;
  yearsWithCompany: number | null;
};

export const employeesService = {
  async allWithPayrolls() {
    const employeesResult = await db.select().from(employees);

    const today = new Date();

    const data = await Promise.all(
      employeesResult.map(async (employee) => {
        const { birthdate: rawBirthdate, hiredOn: rawHiredOn, ...rest } = employee;

        const payrolls = employee.fullName
          ? await db
              .select()
              .from(pubblicaWebPayrolls)
              .where(
                eq(
                  pubblicaWebPayrolls.employeeName,
                  employee.fullName.toUpperCase()
                )
              )
              .orderBy(
                desc(pubblicaWebPayrolls.year),
                desc(pubblicaWebPayrolls.month)
              )
          : [];

        const payrollBirthdate = parsePayrollBirthdate(payrolls[0]?.birthDate);
        const employeeBirthdate = toDate(rawBirthdate);
  const birthdate = employeeBirthdate ?? payrollBirthdate;

        const age = calculateAge(birthdate, today);
        const averagePayroll = calculateAveragePayroll(payrolls);
        const hiredOn = toDate(rawHiredOn);
        const yearsWithCompany = hiredOn ? differenceInYears(today, hiredOn) : null;

        return {
          ...rest,
          birthdate,
          hiredOn,
          payrolls,
          age,
          averagePayroll,
          yearsWithCompany,
        } satisfies EmployeeWithPayrolls;
      })
    );

    return data;
  },
};

const calculateAge = (birthdate: Date | null, referenceDate: Date): number | null => {
  if (!birthdate || !isValid(birthdate)) return null;
  try {
    return differenceInYears(referenceDate, birthdate);
  } catch (error) {
    console.error(`Failed to parse birthdate: ${birthdate}`, error);
    return null;
  }
};

const calculateAveragePayroll = (
  payrolls: Array<{ net: number }>
): number => {
  if (payrolls.length === 0) return 0;
  const total = payrolls.reduce((sum, payroll) => sum + payroll.net, 0);
  return total / payrolls.length;
};

const parsePayrollBirthdate = (birthdate: string | null | undefined): Date | null => {
  if (!birthdate) return null;

  const parsed = parse(birthdate, "dd/MM/yyyy", new Date());

  return isValid(parsed) ? parsed : null;
};

const toDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null;

  if (value instanceof Date) return value;

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
