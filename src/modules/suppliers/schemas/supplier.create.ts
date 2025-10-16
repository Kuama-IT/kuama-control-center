import { type suppliers } from "@/drizzle/schema";

export type SupplierCreateDto = typeof suppliers.$inferInsert;
