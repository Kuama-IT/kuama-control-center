import { firstOrThrow } from "@/utils/array-utils";
import { db } from "@/drizzle/drizzle-db";
import { employeesDb } from "./employees.db";
import { employees } from "@/drizzle/schema";
import { dipendentiInCloudApiClient } from "../dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { youtrackApiClient } from "../you-track/youtrack-api-client";
import { EmployeesRead } from "./schemas/employees-read";
import { youTrackUtils } from "@/modules/you-track/youtrack-utils";

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

    console.log(ytUsers);

    const values = dicEmployees.map((emp) => {
      const ytAvatarUrl = ytUsers.find((u) => u.email === emp.email)?.avatarUrl;
      const avatarUrl = ytAvatarUrl
        ? youTrackUtils.prefixWithYouTrackAvatarBaseUrl(ytAvatarUrl)
        : null;
      return {
        email: emp.email,
        name: emp.first_name,
        surname: emp.last_name,
        birthdate: emp.birth_date
          ? new Date(emp.birth_date).toISOString()
          : null,
        fullName: emp.full_name,
        dipendentiInCloudId: emp.person_id.toString(),
        phoneNumber: emp.phone_number,
        iban: emp.iban,
        avatarUrl,
      };
    });

    for (const value of values) {
      await db
        .insert(employees)
        .values(value)
        .onConflictDoUpdate({
          target: employees.email,
          set: {
            name: value.name,
            surname: value.surname,
            birthdate: value.birthdate,
            fullName: value.fullName,
            avatarUrl: value.avatarUrl,
            dipendentiInCloudId: value.dipendentiInCloudId,
            phoneNumber: value.phoneNumber,
            iban: value.iban,
          },
        });
    }
  },
};
