"use server";
import { db } from "@/drizzle/drizzle-db";
import { employees } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function getById(id: number) {
  const res = await db.select().from(employees).where(eq(employees.id, id));

  return firstOrThrow(res);
}

const handled = handleServerErrors(getById);
export default handled;

export type KEmployeeById = Awaited<ReturnType<typeof getById>>;
