"use server";
import { db } from "@/drizzle/drizzle-db";
import {
  absenceDays,
  employees,
  payrolls,
  projectDailyRates,
  teams,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

async function deleteEmployee(id: number) {
  return db.transaction(async (trx) => {
    await trx.delete(absenceDays).where(eq(absenceDays.employeeId, id));
    await trx.delete(payrolls).where(eq(payrolls.employeeId, id));
    await trx.delete(employees).where(eq(employees.id, id));
  });
}

const handled = handleServerErrors(deleteEmployee);
export default handled;
