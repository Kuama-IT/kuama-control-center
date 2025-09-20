import { db } from "@/drizzle/drizzle-db";
import {
  cashFlowEntry,
  cashFlowCategory,
  cashFlowClient,
  cashFlowImport,
} from "@/drizzle/schema";

// Tipi base
export type CashFlowEntry = typeof cashFlowEntry.$inferSelect;
export type CashFlowCategory = typeof cashFlowCategory.$inferSelect;
export type CashFlowClient = typeof cashFlowClient.$inferSelect;
export type CashFlowImport = typeof cashFlowImport.$inferSelect;

// Recupera lo storico del flusso di cassa
export async function getCashFlowHistory({
  from,
  to,
  categoryId,
  clientId,
}: {
  from?: Date;
  to?: Date;
  categoryId?: number;
  clientId?: number;
}) {
  // Query base
  let query = db.select().from(cashFlowEntry);
  // Filtri
  if (from) query = query.where(cashFlowEntry.date.gte(from));
  if (to) query = query.where(cashFlowEntry.date.lte(to));
  if (categoryId) query = query.where(cashFlowEntry.categoryId.eq(categoryId));
  if (clientId) query = query.where(cashFlowEntry.clientId.eq(clientId));
  return await query;
}

// Recupera categorie
export async function getCashFlowCategories() {
  return await db.select().from(cashFlowCategory);
}

// Recupera clienti
export async function getCashFlowClients() {
  return await db.select().from(cashFlowClient);
}

// Recupera import Excel
export async function getCashFlowImports() {
  return await db.select().from(cashFlowImport);
}

// Funzione di proiezione (esempio: media mobile)
export function forecastCashFlow(entries: CashFlowEntry[], months: number = 3) {
  // Semplice media mobile degli ultimi N mesi
  const now = new Date();
  const lastEntries = entries.filter((e) => {
    const diff =
      (now.getTime() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diff <= months;
  });
  const total = lastEntries.reduce(
    (acc, e) => acc + (e.isIncome ? e.amount : -e.amount),
    0,
  );
  return total / months;
}

// TODO: funzioni per import da Fatture in Cloud, Pubblica Web, Excel
