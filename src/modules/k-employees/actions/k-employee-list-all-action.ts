"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { kEmployeesListAllCacheTag } from "../k-employees-cache-keys";

const kEmployeeListAll = async () =>
  await db
    .select()
    .from(kEmployees)
    .orderBy(asc(kEmployees.payrollRegistrationNumber));

const cached = unstable_cache(kEmployeeListAll, [], {
  revalidate: 60,
  tags: [kEmployeesListAllCacheTag],
});

const handled = handleServerErrors(kEmployeeListAll);
export default handled;

export type KEmployeesListAllActionResult = Awaited<
  ReturnType<typeof kEmployeeListAll>
>;
