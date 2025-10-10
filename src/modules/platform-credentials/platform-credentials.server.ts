import { z } from "zod";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { db } from "@/drizzle/drizzle-db";
import { platformCredentialsDb } from "./platform-credentials.db";
import type {
  PlatformCredentialsFullRead,
  PlatformCredentialsInsert,
  PlatformCredentialsValidForm,
} from "./schemas/platform-credentials.schemas";
import { platformCredentialsInsertSchema } from "./schemas/platform-credentials.schemas";
import type { ProjectRead } from "@/modules/projects/schemas/projects.read.schema";
import type { EmployeeRead } from "@/modules/employees/schemas/employee-read";
import { auth } from "@/modules/auth/auth";

const idSchema = z.number().int().positive();

async function listAll(): Promise<PlatformCredentialsFullRead[]> {
  const rows: any[] = await platformCredentialsDb.listAll();

  const employeeIds = new Set<number>();
  const projectIds = new Set<number>();
  rows.forEach((row: any) => {
    const rels: Array<{
      employeeId?: number | null;
      projectId?: number | null;
    }> = row.platformCredentialsToEmployeesAndProjects ?? [];
    rels.forEach(({ employeeId, projectId }) => {
      if (employeeId) employeeIds.add(employeeId);
      if (projectId) projectIds.add(projectId);
    });
  });

  const employees = (await platformCredentialsDb.fetchEmployeesByIds(
    Array.from(employeeIds),
  )) as EmployeeRead[];
  const projects = (await platformCredentialsDb.fetchProjectsByIds(
    Array.from(projectIds),
  )) as ProjectRead[];
  const employeeMap = new Map<number, EmployeeRead>(
    employees.map((e) => [e.id, e]),
  );
  const projectMap = new Map<number, ProjectRead>(
    projects.map((p) => [p.id, p]),
  );

  return rows.map((row: any) => {
    const { platformCredentialsToEmployeesAndProjects, ...credential } = row;
    let enhanced: PlatformCredentialsFullRead = {
      ...(credential as PlatformCredentialsFullRead),
    };
    const rels: Array<{
      employeeId?: number | null;
      projectId?: number | null;
    }> = platformCredentialsToEmployeesAndProjects ?? [];
    if (rels.length > 0) {
      const relations: {
        employeeId?: number | null;
        projectId?: number | null;
      } = firstOrThrow(rels);
      const project = relations.projectId
        ? (projectMap.get(relations.projectId) as ProjectRead | undefined)
        : undefined;
      const employee = relations.employeeId
        ? (employeeMap.get(relations.employeeId) as EmployeeRead | undefined)
        : undefined;
      if (project) enhanced = { ...enhanced, project };
      if (employee) enhanced = { ...enhanced, employee };
    }
    return enhanced;
  });
}

async function byClient(rawClientId: unknown) {
  const clientId = idSchema.parse(rawClientId);
  return platformCredentialsDb.listByClient(clientId);
}

async function byId(rawId: unknown): Promise<PlatformCredentialsFullRead> {
  const id = idSchema.parse(rawId);
  const records: any[] = await platformCredentialsDb.getById(id);
  const credentials = firstOrThrow(records) as any;
  const related: any[] =
    await platformCredentialsDb.getFirstRelationByCredentialsId(id);
  let enhanced: PlatformCredentialsFullRead = credentials as any;
  if (related.length > 0) {
    const { projectId, employeeId } = firstOrThrow(related) as {
      projectId?: number | null;
      employeeId?: number | null;
    };
    if (projectId) {
      const projectRes = (await platformCredentialsDb.fetchProjectsByIds([
        projectId,
      ])) as ProjectRead[];
      const project = firstOrThrow(projectRes) as ProjectRead;
      enhanced = { ...enhanced, project };
    }
    if (employeeId) {
      const employeeRes = (await platformCredentialsDb.fetchEmployeesByIds([
        employeeId,
      ])) as EmployeeRead[];
      const employee = firstOrThrow(employeeRes) as EmployeeRead;
      enhanced = { ...enhanced, employee };
    }
  }
  return enhanced;
}

async function create(raw: PlatformCredentialsValidForm) {
  const parsed: PlatformCredentialsInsert =
    platformCredentialsInsertSchema.parse(raw);
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }
  await db.transaction(async (trx) => {
    const inserted = (await platformCredentialsDb.insertCredentials(
      parsed,
      trx,
    )) as Array<{ id: number }>;
    const { id } = firstOrThrow(inserted) as { id: number };
    if (parsed.clientId && parsed.employeeId) {
      const client = await platformCredentialsDb.assertClientExists(
        parsed.clientId,
        trx,
      );
      if (client.length === 0) {
        throw new Error(`Client with ID ${parsed.clientId} not found`);
      }
      const employee = await platformCredentialsDb.assertEmployeeExists(
        parsed.employeeId,
        trx,
      );
      if (employee.length === 0) {
        throw new Error(`Employee with ID ${parsed.employeeId} not found`);
      }
      await platformCredentialsDb.insertRelation(
        id,
        { employeeId: parsed.employeeId, projectId: parsed.projectId },
        trx,
      );
    }
  });
}

async function remove(rawId: unknown) {
  const id = idSchema.parse(rawId);
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }
  await db.transaction(async (trx) => {
    await platformCredentialsDb.deleteRelationsByCredentialsId(id, trx);
    await platformCredentialsDb.deleteCredentialsById(id, trx);
  });
}

export const platformCredentialsServer = {
  // Note: do not wrap with handleServerErrors here; actions layer is responsible for wrapping
  all: listAll,
  byClient: byClient,
  byId: byId,
  create: create,
  delete: remove,
};
