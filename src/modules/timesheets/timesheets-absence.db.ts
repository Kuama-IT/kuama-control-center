import { db } from "@/drizzle/drizzle-db";
import { absenceReasons } from "@/drizzle/schema";

export const timesheetsAbsenceDb = {
    selectAbsenceReasons() {
        return db.select().from(absenceReasons);
    },
};
