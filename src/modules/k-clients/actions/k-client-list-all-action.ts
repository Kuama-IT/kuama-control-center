import { db } from "@/drizzle/drizzle-db";
import { kClients, kEmployees, kProjects, kTeams } from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import {
  KClientListItem,
  KProjectWithTeam,
} from "@/modules/k-clients/k-clients-server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { unstable_cache } from "next/cache";
import { kClientsListAllCacheTag } from "../k-clients-cache-tags";

const readClientsWithVat = async () => {
  return await db.query.kClients.findMany({
    with: {
      kClientsVats: {
        with: {
          kVat: true,
        },
      },
    },
    orderBy: [asc(kClients.name)],
  });
};
type ClientWithVatList = Awaited<ReturnType<typeof readClientsWithVat>>;

const clientProjectsAndTeam = async (clientId: number) => {
  const projects = await db
    .select({ id: kProjects.id, name: kProjects.name })
    .from(kProjects)
    .where(eq(kProjects.clientId, clientId));

  const employeesWorkingForClient = await db
    .selectDistinct({ employeeId: kTeams.employeeId })
    .from(kTeams)
    .where(
      inArray(
        kTeams.projectId,
        projects.map((project) => project.id),
      ),
    );

  const projectsWithTeam: KProjectWithTeam[] = [];
  for (const kProject of projects) {
    const team = await db
      .select({ employeeId: kTeams.employeeId })
      .from(kTeams)
      .where(eq(kTeams.projectId, kProject.id));
    const employees = await db
      .select()
      .from(kEmployees)
      .where(
        inArray(
          kEmployees.id,
          team.map((t) => t.employeeId),
        ),
      );
    projectsWithTeam.push({
      ...kProject,
      team: employees,
    });
  }

  return {
    projects: projectsWithTeam,
    employeesWorkingForClient,
  };
};

const clientsWithProjectsAndTeam = async (baseClients: ClientWithVatList) => {
  const clients: KClientListItem[] = [];
  for (const { kClientsVats, ...client } of baseClients) {
    const { projects, employeesWorkingForClient } = await clientProjectsAndTeam(
      client.id,
    );
    clients.push({
      ...client,
      kVats: kClientsVats.map((it) => it.kVat),
      avatarUrl: client.avatarUrl,
      projectsCount: projects.length,
      projects,
      employeesWorkingForClientCount: employeesWorkingForClient.length,
    });
  }

  return clients;
};

const kClientsListAllAction = async (): Promise<KClientListItem[]> => {
  const clients = await readClientsWithVat();
  const enhancedClients = await clientsWithProjectsAndTeam(clients);
  return enhancedClients.filter(
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
