import { db, Transaction } from "@/drizzle/drizzle-db";
import { absenceDays, employees, presenceDays, teams } from "@/drizzle/schema";
import { asc, eq, ilike } from "drizzle-orm";

export const employeesDb = {
    listAll(tx?: Transaction) {
        return (tx ?? db)
            .select()
            .from(employees)
            .orderBy(asc(employees.payrollRegistrationNumber));
    },

    getById(id: number, tx?: Transaction) {
        return (tx ?? db).select().from(employees).where(eq(employees.id, id));
    },

    async findByFullName(fullName: string, tx?: Transaction) {
        // performs a case insensitive search on fullName
        const client = tx ?? db;
        const res = await client
            .select()
            .from(employees)
            .where(ilike(employees.fullName, fullName));
        return res[0] || null;
    },

    update(employee: UpdateEmployee, tx?: Transaction) {
        const client = tx ?? db;

        return client
            .update(employees)
            .set(employee)
            .where(eq(employees.id, employee.id));
    },

    deletePresenceByEmployeeId(id: number, tx?: Transaction) {
        return (tx ?? db)
            .delete(presenceDays)
            .where(eq(presenceDays.employeeId, id));
    },

    deleteAbsenceByEmployeeId(id: number, tx?: Transaction) {
        return (tx ?? db)
            .delete(absenceDays)
            .where(eq(absenceDays.employeeId, id));
    },

    deleteTeamsByEmployeeId(id: number, tx?: Transaction) {
        return (tx ?? db).delete(teams).where(eq(teams.employeeId, id));
    },

    deleteEmployeeById(id: number, tx?: Transaction) {
        return (tx ?? db).delete(employees).where(eq(employees.id, id));
    },
};

type UpdateEmployee = typeof employees.$inferInsert & {
    id: number;
};
