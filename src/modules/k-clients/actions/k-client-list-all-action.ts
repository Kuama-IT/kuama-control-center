import { db } from "@/drizzle/drizzle-db";
import {
  clients,
  clientsVats,
  employees,
  projects as projectsTable,
  teams,
  vats,
} from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { KClientListItem } from "@/modules/k-clients/k-clients-server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { unstable_cache } from "next/cache";

const readClientsWithDetails = async () =>
  db
    .select({
      clientId: clients.id,
      clientName: clients.name,
      clientAvatarUrl: clients.avatarUrl,
      youTrackRingId: clients.youTrackRingId,
      vatId: clientsVats.vatId,
      vat: vats,
      projectId: projectsTable.id,
      projectName: projectsTable.name,
      teamEmployeeId: teams.employeeId,
      employeeId: employees.id,
      employee: employees,
    })
    .from(clients)
    .leftJoin(clientsVats, eq(clients.id, clientsVats.clientId))
    .leftJoin(vats, eq(clientsVats.vatId, vats.id))
    .leftJoin(projectsTable, eq(clients.id, projectsTable.clientId))
    .leftJoin(teams, eq(projectsTable.id, teams.projectId))
    .leftJoin(employees, eq(teams.employeeId, employees.id))
    .orderBy(asc(clients.name));

const clientsWithProjectsAndTeam = async () => {
  const data = await readClientsWithDetails();

  const clientsMap = new Map<number, KClientListItem>();

  for (const row of data) {
    if (!clientsMap.has(row.clientId)) {
      clientsMap.set(row.clientId, {
        id: row.clientId,
        name: row.clientName,
        avatarUrl: row.clientAvatarUrl,
        vats: [],
        projects: [],
        projectsCount: 0,
        employeesWorkingForClientCount: 0,
        youTrackRingId: row.youTrackRingId,
      });
    }

    const client = clientsMap.get(row.clientId)!;

    // Add VATs
    if (row.vatId && !client.vats.some((vat) => vat.id === row.vatId)) {
      client.vats.push(row.vat!);
    }

    // Add Projects
    if (row.projectId && !client.projects.some((p) => p.id === row.projectId)) {
      client.projects.push({
        id: row.projectId,
        name: row.projectName,
        team: [],
      });
      client.projectsCount++;
    }

    // Add Employees to Projects
    const project = client.projects.find((p) => p.id === row.projectId);
    if (
      project &&
      row.employeeId &&
      row.employee &&
      !project.team.some((e) => e.id === row.employeeId)
    ) {
      project.team.push(row.employee);
    }

    // Count unique employees working for the client
    if (
      row.employeeId &&
      !client.projects.some((p) => p.team.some((e) => e.id === row.employeeId))
    ) {
      client.employeesWorkingForClientCount++;
    }
  }

  return Array.from(clientsMap.values());
};

const clientsListAllAction = async (): Promise<KClientListItem[]> => {
  const clients = await clientsWithProjectsAndTeam();
  return clients.filter(
    (client) => client.projectsCount > 0 || client.name === "Kuama"
  );
};

// TODO pass over user to the list: the query should filter only clients the the employee is working for or show all clients if the user is admin
const handled = handleServerErrors(clientsListAllAction);
export default handled;

export type KClientListAllAction = Awaited<
  ReturnType<typeof clientsListAllAction>
>;
