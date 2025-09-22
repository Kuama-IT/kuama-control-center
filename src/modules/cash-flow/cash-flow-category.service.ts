import { db } from "@/drizzle/drizzle-db";
import { cashFlowCategory } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { CashFlowCategoryRead } from "./schemas/cash-flow-category-read";

export const cashFlowCategoryService = {
  async getAll(): Promise<CashFlowCategoryRead[]> {
    return await db
      .select({
        name: cashFlowCategory.name,
        id: cashFlowCategory.id,
        type: cashFlowCategory.type,
      })
      .from(cashFlowCategory)
      .orderBy(desc(cashFlowCategory.name));
  },
  async create(name: string, type: "income" | "expense") {
    await db.insert(cashFlowCategory).values({ name, type });
  },
  async delete(id: number) {
    await db.delete(cashFlowCategory).where(eq(cashFlowCategory.id, id));
  },
  async update(id: number, name: string) {
    await db
      .update(cashFlowCategory)
      .set({ name })
      .where(eq(cashFlowCategory.id, id));
  },
};
