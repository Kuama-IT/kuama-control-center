"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kEmployees } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";
import { unstable_cache } from "next/cache";
import { kAbsenceDaysListCacheTag } from "@/modules/k-absence-days/k-absence-days-cache-tags";

async function kAbsenceDaysList({ from, to }: { from: Date; to: Date }) {
  return db
    .select()
    .from(kAbsenceDays)
    .leftJoin(kEmployees, eq(kAbsenceDays.employeeId, kEmployees.id))
    .where(
      and(
        gte(kAbsenceDays.date, format(from, "yyyy-MM-dd")),
        lte(kAbsenceDays.date, format(to, "yyyy-MM-dd")),
      ),
    );
}

const cached = async ({ from, to }: { from: Date; to: Date }) => {
  return await unstable_cache(
    kAbsenceDaysList,
    [from.toISOString(), to.toISOString()],
    {
      revalidate: 60,
      tags: [kAbsenceDaysListCacheTag],
    },
  )({ from, to });
};

const managed = handleServerErrors(cached);
export default managed;

export type KAbsenceDaysList = Awaited<ReturnType<typeof kAbsenceDaysList>>;
