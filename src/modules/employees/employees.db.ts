import { db } from "@/drizzle/drizzle-db";
import { absenceDays, employees, presenceDays, teams } from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";

export const employeesDb = {
  listAll(client: any = db) {
    return client
      .select()
      .from(employees)
      .orderBy(asc(employees.payrollRegistrationNumber));
  },

  getById(id: number, client: any = db) {
    return client.select().from(employees).where(eq(employees.id, id));
  },

  deletePresenceByEmployeeId(id: number, client: any = db) {
    return client.delete(presenceDays).where(eq(presenceDays.employeeId, id));
  },

  deleteAbsenceByEmployeeId(id: number, client: any = db) {
    return client.delete(absenceDays).where(eq(absenceDays.employeeId, id));
  },

  deleteTeamsByEmployeeId(id: number, client: any = db) {
    return client.delete(teams).where(eq(teams.employeeId, id));
  },

  deleteEmployeeById(id: number, client: any = db) {
    return client.delete(employees).where(eq(employees.id, id));
  },
};
