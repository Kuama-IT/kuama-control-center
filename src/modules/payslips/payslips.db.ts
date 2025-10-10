import { db, Transaction } from "@/drizzle/drizzle-db";
import { payslips } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const payslipsDb = {
  create(payslip: CreatePayslip, tx?: Transaction) {
    return (tx ?? db).insert(payslips).values(payslip);
  },
  allByEmployeeId(employeeId: number) {
    return db
      .select()
      .from(payslips)
      .where(eq(payslips.employeeId, employeeId))
      .orderBy(desc(payslips.year), desc(payslips.month));
  },
};

type CreatePayslip = typeof payslips.$inferInsert;
