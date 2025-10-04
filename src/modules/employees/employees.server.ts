import { z } from "zod";
import { firstOrThrow } from "@/utils/array-utils";
import { db } from "@/drizzle/drizzle-db";
import { employeesDb } from "./employees.db";
import { employees as employeesTable } from "@/drizzle/schema";

const idSchema = z.number().int().positive();

export type Employee = typeof employeesTable.$inferSelect;

export const employeesServer = {
  async listAll(): Promise<Employee[]> {
    return employeesDb.listAll();
  },

  async byId(rawId: unknown): Promise<Employee> {
    const id = idSchema.parse(rawId);
    const rows = await employeesDb.getById(id);
    return firstOrThrow(rows);
  },

  async deleteEmployee(rawId: unknown): Promise<void> {
    const id = idSchema.parse(rawId);
    await db.transaction(async (trx) => {
      await employeesDb.deletePresenceByEmployeeId(id, trx);
      await employeesDb.deleteAbsenceByEmployeeId(id, trx);
      await employeesDb.deleteTeamsByEmployeeId(id, trx);
      await employeesDb.deleteEmployeeById(id, trx);
    });
  },
};
