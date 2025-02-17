"use server";
import { db } from "@/drizzle/drizzle-db";
import { kEmployees } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function getById(id: number) {
  const res = await db.select().from(kEmployees).where(eq(kEmployees.id, id));

  return firstOrThrow(res);
}

export default handleServerErrors(getById);
