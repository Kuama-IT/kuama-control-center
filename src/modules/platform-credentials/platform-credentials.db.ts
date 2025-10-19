import { eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { platformCredentials } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

export const platformCredentialsDb = {
    listAll() {
        return db.select().from(platformCredentials);
    },

    async getById(id: number) {
        const res = await db
            .select()
            .from(platformCredentials)
            .where(eq(platformCredentials.id, id));

        return firstOrThrow(res);
    },

    findManyByProjectIds(projectIds: number[]) {
        return db
            .select()
            .from(platformCredentials)
            .where(inArray(platformCredentials.projectId, projectIds));
    },
};
