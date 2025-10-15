import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { organizations } from "@/drizzle/schema";

export const organizationsDb = {
    getAll() {
        return db.select().from(organizations);
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
