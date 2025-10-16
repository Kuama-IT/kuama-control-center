import { type suppliers } from "@/drizzle/schema";

export type SupplierRead = typeof suppliers.$inferInsert;
