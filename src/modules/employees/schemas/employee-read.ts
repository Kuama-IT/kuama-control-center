import { type employees } from "@/drizzle/schema";

export type EmployeeRead = typeof employees.$inferSelect;
