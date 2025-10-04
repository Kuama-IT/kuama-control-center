"use server";
import { db } from "@/drizzle/drizzle-db";
import { employees } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function getEmployeeById(id: number) {
  const res = await db.select().from(employees).where(eq(employees.id, id));

  return firstOrThrow(res);
}

const handled = handleServerErrors(getEmployeeById);
export default handled;

export type EmployeeById = Awaited<ReturnType<typeof getEmployeeById>>;
