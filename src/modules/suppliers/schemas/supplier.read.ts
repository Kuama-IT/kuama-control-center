import { type suppliers } from "@/drizzle/schema";

export type SupplierReadDto = typeof suppliers.$inferSelect;
