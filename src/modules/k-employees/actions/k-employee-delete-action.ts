"use server";
import { db } from "@/drizzle/drizzle-db";
import {
  kAbsenceDays,
  kEmployees,
  kPresenceDays,
  kTeams,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

async function deleteKEmployee(id: number) {
  await db.transaction(async (trx) => {
    await trx.delete(kPresenceDays).where(eq(kPresenceDays.employeeId, id));
    await trx.delete(kAbsenceDays).where(eq(kAbsenceDays.employeeId, id));
    await trx.delete(kTeams).where(eq(kTeams.employeeId, id));
    await trx.delete(kEmployees).where(eq(kEmployees.id, id));
  });
}

const handled = handleServerErrors(deleteKEmployee);
export default handled;
