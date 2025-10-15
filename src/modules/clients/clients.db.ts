import { db } from "@/drizzle/drizzle-db";
import { asc, eq, ilike, isNull } from "drizzle-orm";
import { clients } from "@/drizzle/schema";

// Basic data-access layer for the `clients` table only (no joins)
export const clientsDb = {
    async all() {
        return db.select().from(clients).orderBy(asc(clients.name));
    },
    async allWhereOrganizationIdIsNull() {
        return db
            .select()
            .from(clients)
            .where(isNull(clients.organizationId))
            .orderBy(asc(clients.name));
    },

    async getById(id: number) {
        const rows = await db
            .select()
            .from(clients)
            .where(eq(clients.id, id))
            .limit(1);
        return rows[0] ?? null;
    },

    async findByExactName(name: string) {
        const rows = await db
            .select()
            .from(clients)
            .where(eq(clients.name, name))
            .limit(1);
        return rows[0] ?? null;
    },

    async searchByName(query: string, limit = 10) {
        // Use ilike for case-insensitive pattern matching
        return db
            .select()
            .from(clients)
            .where(ilike(clients.name, `%${query}%`))
            .orderBy(asc(clients.name))
            .limit(limit);
    },

    async create(data: typeof clients.$inferInsert) {
        const rows = await db.insert(clients).values(data).returning();
        return rows[0];
    },

    async upsertByName(name: string) {
        const existing = await this.findByExactName(name);
        if (existing) return existing;
        const rows = await db.insert(clients).values({ name }).returning();
        return rows[0] ?? null;
    },

    async update(id: number, data: Partial<typeof clients.$inferInsert>) {
        const rows = await db
            .update(clients)
            .set({ ...data })
            .where(eq(clients.id, id))
            .returning();
        return rows[0] ?? null;
    },

    async remove(id: number) {
        await db.delete(clients).where(eq(clients.id, id));
        return true;
    },
};
