"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { employeesListAllCacheTag } from "../employees-cache-tags";

const listAllEmployees = async () =>
  await db
    .select()
    .from(kEmployees)
    .orderBy(asc(kEmployees.payrollRegistrationNumber));

unstable_cache(listAllEmployees, [], {
  revalidate: 60,
  tags: [employeesListAllCacheTag],
});

const handled = handleServerErrors(listAllEmployees);
export default handled;

export type EmployeesListAllActionResult = Awaited<
  ReturnType<typeof listAllEmployees>
>;
