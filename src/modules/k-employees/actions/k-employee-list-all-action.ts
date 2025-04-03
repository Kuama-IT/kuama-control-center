"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { asc } from "drizzle-orm";

const kEmployeeListAll = async () =>
  await db
    .select()
    .from(kEmployees)
    .orderBy(asc(kEmployees.payrollRegistrationNumber));

const handled = handleServerErrors(kEmployeeListAll);
export default handled;

export type KEmployeesListAllActionResult = Awaited<
  ReturnType<typeof kEmployeeListAll>
>;
