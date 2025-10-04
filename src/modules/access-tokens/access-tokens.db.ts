import { db } from "@/drizzle/drizzle-db";
import { accessTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export type AccessTokenRecord = typeof accessTokens.$inferSelect;
export type AccessTokenInsert = typeof accessTokens.$inferInsert;

export const INFINITE_USAGES = -1;

export const accessTokensDb = {
  findAll(): Promise<AccessTokenRecord[]> {
    return db.select().from(accessTokens);
  },
  findUnlimited(): Promise<AccessTokenRecord[]> {
    return db
      .select()
      .from(accessTokens)
      .where(eq(accessTokens.allowedUsages, INFINITE_USAGES))
      .limit(1);
  },
  findById(id: number): Promise<AccessTokenRecord[]> {
    return db
      .select()
      .from(accessTokens)
      .where(eq(accessTokens.id, id))
      .limit(1);
  },
  findByToken(token: string): Promise<AccessTokenRecord[]> {
    return db
      .select()
      .from(accessTokens)
      .where(eq(accessTokens.token, token))
      .limit(1);
  },
  insert(values: AccessTokenInsert): Promise<AccessTokenRecord[]> {
    return db.insert(accessTokens).values(values).returning();
  },
  deleteById(id: number) {
    return db.delete(accessTokens).where(eq(accessTokens.id, id));
  },
  updateUsage(id: number, usageCount: number) {
    return db
      .update(accessTokens)
      .set({ usageCount })
      .where(eq(accessTokens.id, id));
  },
};
