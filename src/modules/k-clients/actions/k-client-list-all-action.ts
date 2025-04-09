import { db } from "@/drizzle/drizzle-db";
import {
  kClients,
  kClientsVats,
  kEmployees,
  kProjects,
  kTeams,
  kVats,
} from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { KClientListItem } from "@/modules/k-clients/k-clients-server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { unstable_cache } from "next/cache";
import { kClientsListAllCacheTag } from "../k-clients-cache-tags";

const readClientsWithDetails = async () =>
  db
    .select({
      clientId: kClients.id,
      clientName: kClients.name,
      clientAvatarUrl: kClients.avatarUrl,
      youTrackRingId: kClients.youTrackRingId,
      vatId: kClientsVats.vatId,
      vat: kVats,
      projectId: kProjects.id,
      projectName: kProjects.name,
      teamEmployeeId: kTeams.employeeId,
      employeeId: kEmployees.id,
      employee: kEmployees,
    })
    .from(kClients)
    .leftJoin(kClientsVats, eq(kClients.id, kClientsVats.clientId))
    .leftJoin(kVats, eq(kClientsVats.vatId, kVats.id))
    .leftJoin(kProjects, eq(kClients.id, kProjects.clientId))
    .leftJoin(kTeams, eq(kProjects.id, kTeams.projectId))
    .leftJoin(kEmployees, eq(kTeams.employeeId, kEmployees.id))
    .orderBy(asc(kClients.name));

const clientsWithProjectsAndTeam = async () => {
  const data = await readClientsWithDetails();

  const clientsMap = new Map<number, KClientListItem>();

  for (const row of data) {
    if (!clientsMap.has(row.clientId)) {
      clientsMap.set(row.clientId, {
        id: row.clientId,
        name: row.clientName,
        avatarUrl: row.clientAvatarUrl,
        kVats: [],
        projects: [],
        projectsCount: 0,
        employeesWorkingForClientCount: 0,
        youTrackRingId: row.youTrackRingId,
      });
    }

    const client = clientsMap.get(row.clientId)!;

    // Add VATs
    if (row.vatId && !client.kVats.some((vat) => vat.id === row.vatId)) {
      client.kVats.push(row.vat!);
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

const kClientsListAllAction = async (): Promise<KClientListItem[]> => {
  const clients = await clientsWithProjectsAndTeam();
  return clients.filter(
    (client) => client.projectsCount > 0 || client.name === "Kuama",
  );
};

const cached = unstable_cache(kClientsListAllAction, [], {
  revalidate: 60,
  tags: [kClientsListAllCacheTag], // TODO Invalidate this tag when a client is created or deleted or imported
});

// TODO pass over user to the list: the query should filter only clients the the employee is working for or show all clients if the user is admin
const handled = handleServerErrors(cached);
export default handled;

export type KClientListAllAction = Awaited<
  ReturnType<typeof kClientsListAllAction>
>;
