import { payslips } from "@/drizzle/schema";

export type PayslipRead = typeof payslips.$inferSelect;
