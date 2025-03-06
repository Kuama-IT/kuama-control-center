"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function deleteKEmployee(id: number) {
  await db.delete(kEmployees).where(eq(kEmployees.id, id));
}

export default handleServerErrors(deleteKEmployee);
