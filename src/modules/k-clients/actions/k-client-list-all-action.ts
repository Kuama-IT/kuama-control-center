import { db } from "@/drizzle/drizzle-db";
import { kClients, kProjects, kTeams } from "@/drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { KClientListItem } from "@/modules/k-clients/k-clients-server";
import { handleServerErrors } from "@/utils/server-action-utils";

const kClientsListAllAction = async (): Promise<KClientListItem[]> => {
  const clients = await db.query.kClients.findMany({
    with: {
      kVats: true,
    },
    orderBy: [asc(kClients.name)],
  });
  // remove last trailing slash from the base url

  const enhancedClients = await Promise.all(
    clients.map(async (client) => {
      const projects = await db
        .select({ id: kProjects.id })
        .from(kProjects)
        .where(eq(kProjects.clientId, client.id));

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
        ...client,
        avatarUrl: client.avatarUrl,
        projectsCount: projects.length,
        employeesWorkingForClientCount: employeesWorkingForClient.length,
      };
    }),
  );

  return enhancedClients.filter(
    (client) => client.projectsCount > 0 || client.name === "Kuama",
  );
};

export default handleServerErrors(kClientsListAllAction);

export type KClientListAllAction = Awaited<
  ReturnType<typeof kClientsListAllAction>
>;
