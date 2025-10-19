import { eq, inArray } from "drizzle-orm";
import { db, type Transaction } from "@/drizzle/drizzle-db";
import { projectMedias, projects } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";

export const projectsDb = {
    async getById(id: number, tx?: Transaction) {
        const dbClient = tx ?? db;
        const res = await dbClient
            .select()
            .from(projects)
            .where(eq(projects.id, id))
            .limit(1);
        return firstOrThrow(res);
    },
    async getByIds(projectIds: number[]) {
        if (projectIds.length === 0) {
            return [];
        }

        return db
            .select()
            .from(projects)
            .where(inArray(projects.id, projectIds));
    },
    async findManyByOrganizationId(organizationId: number) {
        return db
            .select()
            .from(projects)
            .where(eq(projects.organizationId, organizationId));
    },
    async insertProjectMedias(payload: { projectId: number; url: string }[]) {
        if (payload.length === 0) {
            return;
        }

        await db.insert(projectMedias).values(payload).onConflictDoNothing();
    },
};
