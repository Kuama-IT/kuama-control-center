"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees, kTeams } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

async function deleteKEmployee(id: number) {
  await db.transaction(async (trx) => {
    await trx.delete(kTeams).where(eq(kTeams.employeeId, id));
    await trx.delete(kEmployees).where(eq(kEmployees.id, id));
  });
}

export default handleServerErrors(deleteKEmployee);
