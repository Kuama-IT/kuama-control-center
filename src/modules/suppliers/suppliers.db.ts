import { db } from "@/drizzle/drizzle-db";
import { suppliers } from "@/drizzle/schema";

export const suppliersDb = {
    getAll() {
        return db.select().from(suppliers);
    },
};
