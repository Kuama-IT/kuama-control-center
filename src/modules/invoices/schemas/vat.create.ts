import { type vats } from "@/drizzle/schema";

export type VatCreateDto = typeof vats.$inferInsert;
