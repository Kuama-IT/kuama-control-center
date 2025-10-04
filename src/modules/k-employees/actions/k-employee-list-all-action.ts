"use server";
import { db } from "@/drizzle/drizzle-db";
import { employees } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { asc } from "drizzle-orm";

const kEmployeeListAll = async () =>
  await db
    .select()
    .from(employees)
    .orderBy(asc(employees.payrollRegistrationNumber));


const handled = handleServerErrors(kEmployeeListAll);
export default handled;

export type EmployeesListAllActionResult = Awaited<
  ReturnType<typeof kEmployeeListAll>
>;
