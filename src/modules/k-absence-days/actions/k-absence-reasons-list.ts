"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceReasons } from "@/drizzle/schema";
import { unstable_cache } from "next/cache";
import { kAbsenceReasonListCacheTag } from "@/modules/k-absence-days/k-absence-days-cache-tags";

async function kAbsenceReasonsList() {
  const res = await db.select().from(kAbsenceReasons);
  // TODO maybe move to db?
  res.push({
    id: 0,
    name: "Per contratto",
    code: "--",
  });
  return res;
}

const cached = unstable_cache(kAbsenceReasonsList, [], {
  revalidate: 60,
  tags: [kAbsenceReasonListCacheTag],
});

const managed = handleServerErrors(cached);
export default managed;

export type KAbsenceReasonList = Awaited<
  ReturnType<typeof kAbsenceReasonsList>
>;
