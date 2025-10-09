import { z } from "zod";
import { firstOrThrow } from "@/utils/array-utils";
import { db } from "@/drizzle/drizzle-db";
import { employeesDb } from "./employees.db";
import { employees, employees as employeesTable } from "@/drizzle/schema";
import { dipendentiInCloudApiClient } from "../dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { youtrackApiClient } from "../you-track/youtrack-api-client";

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
  async importFromDipendentiInCloudAndYouTrack(): Promise<void> {
    const dicEmployees = await dipendentiInCloudApiClient.getEmployees();

    const ytUsers = await youtrackApiClient.getUsers();

    const values = dicEmployees.map((emp) => ({
      email: emp.email,
      name: emp.first_name,
      surname: emp.last_name,
      birthdate: emp.birth_date ? new Date(emp.birth_date).toISOString() : null,
      fullName: emp.full_name,
      dipendentiInCloudId: emp.person_id.toString(),
      phoneNumber: emp.phone_number,
      iban: emp.iban,
      avatarUrl: ytUsers.find((u) => u.email === emp.email)?.avatarUrl || null,
    }));

    await db
      .insert(employees)
      .values(values)
      .onConflictDoUpdate({
        target: employees.email,
        set: {
          name: employees.name,
          surname: employees.surname,
          birthdate: employees.birthdate,
          fullName: employees.fullName,
          dipendentiInCloudId: employees.dipendentiInCloudId,
          phoneNumber: employees.phoneNumber,
          iban: employees.iban,
          avatarUrl: employees.avatarUrl,
        },
      });
  },
};
