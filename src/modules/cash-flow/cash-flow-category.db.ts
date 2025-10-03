import { db } from "@/drizzle/drizzle-db";
import { cashFlowCategory } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { CashFlowCategoryRead } from "./schemas/cash-flow-category-read";

export const cashFlowCategoryDb = {
  async findAll(): Promise<CashFlowCategoryRead[]> {
    return await db
      .select({
        id: cashFlowCategory.id,
        name: cashFlowCategory.name,
        type: cashFlowCategory.type,
      })
      .from(cashFlowCategory)
      .orderBy(desc(cashFlowCategory.name));
  },

  async insert(data: { name: string; type: "income" | "expense" }): Promise<void> {
    await db.insert(cashFlowCategory).values(data);
  },

  async deleteById(id: number): Promise<void> {
    await db.delete(cashFlowCategory).where(eq(cashFlowCategory.id, id));
  },

  async updateName(data: { id: number; name: string }): Promise<void> {
    await db
      .update(cashFlowCategory)
      .set({ name: data.name })
      .where(eq(cashFlowCategory.id, data.id));
  },
};
