import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { platformCredentials } from "@/drizzle/schema";
import { auth } from "@/modules/auth/auth";
import { employeesDb } from "@/modules/employees/employees.db";
import { type EmployeeRead } from "@/modules/employees/schemas/employee-read";
import { type PlatformCredentialReadExtended } from "@/modules/platform-credentials/schemas/platform-credential-read-extended";
import { projectsDb } from "@/modules/projects/projects.db";
import { type ProjectRead } from "@/modules/projects/schemas/projects.read.schema";
import { platformCredentialsDb } from "./platform-credentials.db";
import {
    type PlatformCredentialsInsert,
    type PlatformCredentialsRead,
    type PlatformCredentialsValidForm,
    platformCredentialsInsertSchema,
} from "./schemas/platform-credentials.schemas";

export const platformCredentialsServer = {
    async all(): Promise<PlatformCredentialReadExtended[]> {
        const result: PlatformCredentialReadExtended[] = [];
        const credentials = await platformCredentialsDb.listAll();

        for (const c of credentials) {
            result.push(await _extend(c));
        }

        return result;
    },
    async byClient(
        organizationId: number,
    ): Promise<PlatformCredentialReadExtended[]> {
        const projects =
            await projectsDb.findManyByOrganizationId(organizationId);

        const result: PlatformCredentialReadExtended[] = [];
        const credentials = await platformCredentialsDb.findManyByProjectIds(
            projects.map((p) => p.id),
        );

        for (const c of credentials) {
            result.push(await _extend(c));
        }

        return result;
    },
    async byId(id: number): Promise<PlatformCredentialReadExtended> {
        const pc = await platformCredentialsDb.getById(id);
        return await _extend(pc);
    },
    async create(raw: PlatformCredentialsValidForm) {
        const parsed: PlatformCredentialsInsert =
            platformCredentialsInsertSchema.parse(raw);
        const session = await auth();

        if (!(session && session.user?.isAdmin)) {
            throw new Error("Only admin is allowed to invoke this action");
        }

        return await db.transaction(async (tx) => {
            if (parsed.projectId) {
                await projectsDb.getById(parsed.projectId, tx);
            }
            if (parsed.employeeId) {
                await employeesDb.getById(parsed.employeeId, tx);
            }

            return await tx
                .insert(platformCredentials)
                .values(parsed)
                .returning({ id: platformCredentials.id });
        });
    },
    async delete(id: number) {
        const session = await auth();
        if (!(session && session.user?.isAdmin)) {
            throw new Error("Only admin is allowed to invoke this action");
        }
        return await db
            .delete(platformCredentials)
            .where(eq(platformCredentials.id, id));
    },
};

async function _extend(
    platformCredential: PlatformCredentialsRead,
): Promise<PlatformCredentialReadExtended> {
    let employee: EmployeeRead | undefined;
    if (platformCredential.employeeId) {
        employee = await employeesDb.getById(platformCredential.employeeId);
    }

    let project: ProjectRead | undefined;
    if (platformCredential.projectId) {
        project = await projectsDb.getById(platformCredential.projectId);
    }

    return {
        ...platformCredential,
        employee,
        project,
    };
}
