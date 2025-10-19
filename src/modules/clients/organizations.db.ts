import { eq } from "drizzle-orm";
import { db, type Transaction } from "@/drizzle/drizzle-db";
import { organizations } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

export const organizationsDb = {
    getAll() {
        return db.select().from(organizations);
    },
    async getById(id: number, tx?: Transaction) {
        const dbClient = tx ?? db;
        const res = await dbClient
            .select()
            .from(organizations)
            .where(eq(organizations.id, id))
            .limit(1);

        return firstOrThrow(res);
    },

    async tryGetByYoutrackRingId(youTrackRingId: string) {
        const [res] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.youTrackRingId, youTrackRingId))
            .limit(1);

        return res;
    },
};
