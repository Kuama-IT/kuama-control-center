"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceReasons } from "@/drizzle/schema";

async function kAbsenceReasonsList() {
  return db.select().from(kAbsenceReasons);
}

const managed = handleServerErrors(kAbsenceReasonsList);
export default managed;

export type KAbsenceReasonList = Awaited<
  ReturnType<typeof kAbsenceReasonsList>
>;
