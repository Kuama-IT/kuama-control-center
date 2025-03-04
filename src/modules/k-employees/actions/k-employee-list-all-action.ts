"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";

const kEmployeeListAll = async () => await db.select().from(kEmployees);

const handled = handleServerErrors(kEmployeeListAll);
export default handled;

export type KEmployeesListAllActionResult = Awaited<
  ReturnType<typeof kEmployeeListAll>
>;
