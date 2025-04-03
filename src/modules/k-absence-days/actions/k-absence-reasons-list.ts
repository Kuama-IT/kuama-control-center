"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceReasons } from "@/drizzle/schema";

async function kAbsenceReasonsList() {
  const res = await db.select().from(kAbsenceReasons);
  res.push({
    id: 0,
    name: "Per contratto",
    code: "--",
  });
  return res;
}

const managed = handleServerErrors(kAbsenceReasonsList);
export default managed;

export type KAbsenceReasonList = Awaited<
  ReturnType<typeof kAbsenceReasonsList>
>;
