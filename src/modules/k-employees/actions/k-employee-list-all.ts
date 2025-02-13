import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";

export const kEmployeeListAll = async () => {
  return await db.select().from(kEmployees);
};
