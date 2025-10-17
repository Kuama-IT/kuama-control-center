import { type vats } from "@/drizzle/schema";

export type VatReadDto = typeof vats.$inferInsert;
