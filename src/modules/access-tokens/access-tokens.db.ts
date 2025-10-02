import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export type AccessTokenRecord = typeof kAccessTokens.$inferSelect;
export type AccessTokenInsert = typeof kAccessTokens.$inferInsert;

export const INFINITE_USAGES = -1;

export const accessTokensDb = {
  findAll(): Promise<AccessTokenRecord[]> {
    return db.select().from(kAccessTokens);
  },
  findUnlimited(): Promise<AccessTokenRecord[]> {
    return db
      .select()
      .from(kAccessTokens)
      .where(eq(kAccessTokens.allowedUsages, INFINITE_USAGES))
      .limit(1);
  },
  findById(id: number): Promise<AccessTokenRecord[]> {
    return db
      .select()
      .from(kAccessTokens)
      .where(eq(kAccessTokens.id, id))
      .limit(1);
  },
  findByToken(token: string): Promise<AccessTokenRecord[]> {
    return db
      .select()
      .from(kAccessTokens)
      .where(eq(kAccessTokens.token, token))
      .limit(1);
  },
  insert(values: AccessTokenInsert): Promise<AccessTokenRecord[]> {
    return db.insert(kAccessTokens).values(values).returning();
  },
  deleteById(id: number) {
    return db.delete(kAccessTokens).where(eq(kAccessTokens.id, id));
  },
  updateUsage(id: number, usageCount: number) {
    return db
      .update(kAccessTokens)
      .set({ usageCount })
      .where(eq(kAccessTokens.id, id));
  },
};
