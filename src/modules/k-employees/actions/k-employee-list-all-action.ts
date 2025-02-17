"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";

const kEmployeeListAll = async () => {
  return await db.select().from(kEmployees);
};

export default handleServerErrors(kEmployeeListAll);
