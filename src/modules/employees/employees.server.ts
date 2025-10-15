import { firstOrThrow } from "@/utils/array-utils";
import { db } from "@/drizzle/drizzle-db";
import { employeesDb } from "./employees.db";
import { employees } from "@/drizzle/schema";
import { dipendentiInCloudApiClient } from "../dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { youtrackApiClient } from "../you-track/youtrack-api-client";
import { type EmployeeRead } from "./schemas/employee-read";
import { youTrackUtils } from "@/modules/you-track/youtrack-utils";
import { type EmployeeReadExtended } from "@/modules/employees/schemas/employee-read-extended";
import { payslipsDb } from "@/modules/payslips/payslips.db";
import { differenceInYears, isValid, parse } from "date-fns";
import { payslipsUtils } from "@/modules/payslips/payslips.utils";

export const employeesServer = {
    async all(): Promise<EmployeeRead[]> {
        return employeesDb.listAll();
    },

    async allExtended(): Promise<EmployeeReadExtended[]> {
        const employeesResult = await employeesDb.listAll();

        return await Promise.all(
            employeesResult.map(async (employee) => {
                return await _extend(employee);
            }),
        );
    },

    async getExtended(id: number): Promise<EmployeeReadExtended> {
        const rows = await employeesDb.getById(id);
        return await _extend(firstOrThrow(rows));
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

        const values = dicEmployees.map((emp) => {
            const ytAvatarUrl = ytUsers.find(
                (u) => u.email === emp.email,
            )?.avatarUrl;
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
                dipendentiInCloudId: emp.id.toString(),
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

const calculateAge = (
    birthdate: Date | null,
    referenceDate: Date,
): number | null => {
    if (!birthdate || !isValid(birthdate)) return null;
    try {
        return differenceInYears(referenceDate, birthdate);
    } catch (error) {
        console.error(`Failed to parse birthdate: ${birthdate}`, error);
        return null;
    }
};

const parseDate = (birthdate: string | null | undefined): Date | null => {
    if (!birthdate) return null;

    const parsed = parse(birthdate, "yyyy-MM-dd", new Date());

    return isValid(parsed) ? parsed : null;
};

async function _extend(employee: EmployeeRead): Promise<EmployeeReadExtended> {
    const today = new Date();
    const employeePayslips = await payslipsDb.allByEmployeeId(employee.id);

    const birthdate = parseDate(employee.birthdate);
    const hiredOn = parseDate(employee.hiredOn);

    const age = calculateAge(birthdate, today);
    const averageNet = payslipsUtils.calculateAverageNet(employeePayslips);
    const averageCost = payslipsUtils.calculateAverageCost(employeePayslips);
    const yearsWithCompany = hiredOn ? differenceInYears(today, hiredOn) : null;

    return {
        ...employee,
        birthdate,
        hiredOn,
        payslips: employeePayslips,
        age,
        averageNet,
        averageCost,
        yearsWithCompany,
    };
}
