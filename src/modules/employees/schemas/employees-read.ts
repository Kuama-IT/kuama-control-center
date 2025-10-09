import { employees } from "@/drizzle/schema";

export type EmployeesRead = typeof employees.$inferSelect;
