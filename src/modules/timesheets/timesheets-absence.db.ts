import { db } from "@/drizzle/drizzle-db";
import { absenceDays, absenceReasons, employees } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";

export type ListAbsenceDaysParams = {
  from: Date;
  to: Date;
};

async function selectAbsenceDays({ from, to }: ListAbsenceDaysParams) {
  return db
    .select()
    .from(absenceDays)
    .leftJoin(employees, eq(absenceDays.employeeId, employees.id))
    .where(
      and(
        gte(absenceDays.date, format(from, "yyyy-MM-dd")),
        lte(absenceDays.date, format(to, "yyyy-MM-dd")),
      ),
    );
}

async function selectAbsenceReasons() {
  return db.select().from(absenceReasons);
}

export const timesheetsAbsenceDb = {
  selectAbsenceDays,
  selectAbsenceReasons,
};

export type AbsenceDaysDbResult = Awaited<ReturnType<typeof selectAbsenceDays>>;
export type AbsenceReasonsDbResult = Awaited<ReturnType<typeof selectAbsenceReasons>>;
