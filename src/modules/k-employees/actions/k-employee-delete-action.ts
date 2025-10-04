"use server";
import { db } from "@/drizzle/drizzle-db";
import {
  absenceDays,
  employees,
  presenceDays,
  teams,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

async function deleteKEmployee(id: number) {
  await db.transaction(async (trx) => {
    await trx.delete(presenceDays).where(eq(presenceDays.employeeId, id));
    await trx.delete(absenceDays).where(eq(absenceDays.employeeId, id));
    await trx.delete(teams).where(eq(teams.employeeId, id));
    await trx.delete(employees).where(eq(employees.id, id));
  });
}

const handled = handleServerErrors(deleteKEmployee);
export default handled;
