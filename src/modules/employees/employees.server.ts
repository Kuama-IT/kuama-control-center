import { z } from "zod";
import { firstOrThrow } from "@/utils/array-utils";
import { db } from "@/drizzle/drizzle-db";
import { employeesDb } from "./employees.db";
import { employees, employees as employeesTable } from "@/drizzle/schema";
import { dipendentiInCloudApiClient } from "../dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { youtrackApiClient } from "../you-track/youtrack-api-client";
import { EmployeesRead } from "./schemas/employees-read";

export const employeesServer = {
  async all(): Promise<EmployeesRead[]> {
    return employeesDb.listAll();
  },

  async get(id: number): Promise<EmployeesRead> {
    const rows = await employeesDb.getById(id);
    return firstOrThrow(rows);
  },

  async deleteEmployee(id: number): Promise<void> {
    await db.transaction(async (tx) => {
      await employeesDb.deletePresenceByEmployeeId(id, tx);
      await employeesDb.deleteAbsenceByEmployeeId(id, tx);
      await employeesDb.deleteTeamsByEmployeeId(id, tx);
      await employeesDb.deleteEmployeeById(id, tx);
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
