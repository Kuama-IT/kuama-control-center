import { db } from "@/drizzle/drizzle-db";
import { pubblicaWebMonthlyBalances } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const pubblicaWebDb = {
  async getMonthlyBalanceByYearAndMonth(year: number, month: number) {
    const res = await db
      .select({
        year: pubblicaWebMonthlyBalances.year,
        month: pubblicaWebMonthlyBalances.month,
        total: pubblicaWebMonthlyBalances.total,
      })
      .from(pubblicaWebMonthlyBalances)
      .where(
        and(
          eq(pubblicaWebMonthlyBalances.year, year),
          eq(pubblicaWebMonthlyBalances.month, month)
        )
      );
    return res[0] || null;
  },
};
