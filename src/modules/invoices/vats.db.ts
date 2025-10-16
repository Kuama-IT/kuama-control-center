import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { vats } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

export const vatsDb = {
    async getById(id: number) {
        const res = await db.select().from(vats).where(eq(vats.id, id));

        return firstOrThrow(res);
    },
};
