"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kEmployees } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";

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

const managed = handleServerErrors(kAbsenceDaysList);
export default managed;

export type KAbsenceDaysList = Awaited<ReturnType<typeof kAbsenceDaysList>>;
