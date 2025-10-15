import { db } from "@/drizzle/drizzle-db";
import { absenceDays, absenceReasons, employees } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { format } from "date-fns";

export const timesheetsAbsenceDb = {
    selectAbsenceReasons() {
        return db.select().from(absenceReasons);
    },
};
