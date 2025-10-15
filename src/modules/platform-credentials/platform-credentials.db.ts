import { db } from "@/drizzle/drizzle-db";
import {
    clients,
    employees,
    platformCredentials,
    platformCredentialsToEmployeesAndProjects,
    projects as projectsTable,
} from "@/drizzle/schema";
import { asc, eq, inArray } from "drizzle-orm";

export const platformCredentialsDb = {
    listAll(client: any = db) {
        return client.query.platformCredentials.findMany({
            with: {
                platformCredentialsToEmployeesAndProjects: true,
            },
            orderBy: asc(platformCredentials.name),
        });
    },

    listByClient(clientId: number, client: any = db) {
        return client.transaction(async (trx: any) => {
            const projects = await trx
                .select({ projectId: projectsTable.id })
                .from(projectsTable)
                .where(eq(projectsTable.clientId, clientId));

            return trx.query.platformCredentials.findMany({
                with: {
                    platformCredentialsToEmployeesAndProjects: {
                        where: (records: any, helpers: any) =>
                            helpers.inArray(
                                records.projectId,
                                projects.map((p: any) => p.projectId),
                            ),
                    },
                },
            });
        });
    },

    getById(id: number, client: any = db) {
        return client
            .select()
            .from(platformCredentials)
            .where(eq(platformCredentials.id, id));
    },

    getFirstRelationByCredentialsId(id: number, client: any = db) {
        return client
            .select()
            .from(platformCredentialsToEmployeesAndProjects)
            .where(
                eq(
                    platformCredentialsToEmployeesAndProjects.platformCredentialsId,
                    id,
                ),
            )
            .limit(1);
    },

    fetchEmployeesByIds(ids: number[], client: any = db) {
        if (!ids.length) return Promise.resolve([]);
        return client
            .select()
            .from(employees)
            .where(inArray(employees.id, ids));
    },

    fetchProjectsByIds(ids: number[], client: any = db) {
        if (!ids.length) return Promise.resolve([]);
        return client
            .select()
            .from(projectsTable)
            .where(inArray(projectsTable.id, ids));
    },

    insertCredentials(values: any, client: any = db) {
        return client
            .insert(platformCredentials)
            .values(values)
            .returning({ id: platformCredentials.id });
    },

    insertRelation(
        credsId: number,
        {
            employeeId,
            projectId,
        }: { employeeId?: number | undefined; projectId?: number | undefined },
        client: any = db,
    ) {
        return client.insert(platformCredentialsToEmployeesAndProjects).values({
            platformCredentialsId: credsId,
            employeeId,
            projectId,
        });
    },

    assertClientExists(id: number, client: any = db) {
        return client.select().from(clients).where(eq(clients.id, id)).limit(1);
    },

    assertEmployeeExists(id: number, client: any = db) {
        return client
            .select()
            .from(employees)
            .where(eq(employees.id, id))
            .limit(1);
    },

    deleteRelationsByCredentialsId(id: number, client: any = db) {
        return client
            .delete(platformCredentialsToEmployeesAndProjects)
            .where(
                eq(
                    platformCredentialsToEmployeesAndProjects.platformCredentialsId,
                    id,
                ),
            );
    },

    deleteCredentialsById(id: number, client: any = db) {
        return client
            .delete(platformCredentials)
            .where(eq(platformCredentials.id, id));
    },
};
