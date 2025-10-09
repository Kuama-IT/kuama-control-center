import { db, Transaction } from "@/drizzle/drizzle-db";
import { payslips } from "@/drizzle/schema";

export const payslipsDb = {
  create(payslip: CreatePayslip, tx?: Transaction) {
    return (tx ?? db).insert(payslips).values(payslip);
  },
};

type CreatePayslip = typeof payslips.$inferInsert;
