import { db } from "@/drizzle/drizzle-db";
import { projectMedias, projects } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export const projectsDb = {
    async findById(projectId: number) {
        return db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });
    },
    async findManyWithClientByIds(projectIds: number[]) {
        if (projectIds.length === 0) {
            return [];
        }

        return db.query.projects.findMany({
            with: {
                client: true,
            },
            where: inArray(projects.id, projectIds),
        });
    },
    async insertProjectMedias(payload: { projectId: number; url: string }[]) {
        if (payload.length === 0) {
            return;
        }

        await db.insert(projectMedias).values(payload).onConflictDoNothing();
    },
};
