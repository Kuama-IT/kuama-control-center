import { organizations } from "@/drizzle/schema";

export type OrganizationRead = typeof organizations.$inferSelect;
