import { db } from "@/drizzle/drizzle-db";
import { kClients, kProjects, kTeams } from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { KClientListItem } from "@/modules/k-clients/k-clients-server";
import { handleServerErrors } from "@/utils/server-action-utils";

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
    .select({ id: kProjects.id })
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

  return {
    projects,
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

export default handleServerErrors(kClientsListAllAction);

export type KClientListAllAction = Awaited<
  ReturnType<typeof kClientsListAllAction>
>;
