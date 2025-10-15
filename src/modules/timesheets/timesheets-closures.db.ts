import { db } from "@/drizzle/drizzle-db";
import { closures } from "@/drizzle/schema";

export const timesheetsClosuresDb = {
    selectClosures() {
        return db.select().from(closures);
    },
};
