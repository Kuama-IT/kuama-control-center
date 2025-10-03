import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kAbsenceReasons, kEmployees } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";

export type ListAbsenceDaysParams = {
  from: Date;
  to: Date;
};

async function selectAbsenceDays({ from, to }: ListAbsenceDaysParams) {
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

async function selectAbsenceReasons() {
  return db.select().from(kAbsenceReasons);
}

export const timesheetsAbsenceDb = {
  selectAbsenceDays,
  selectAbsenceReasons,
};

export type AbsenceDaysDbResult = Awaited<ReturnType<typeof selectAbsenceDays>>;
export type AbsenceReasonsDbResult = Awaited<ReturnType<typeof selectAbsenceReasons>>;
