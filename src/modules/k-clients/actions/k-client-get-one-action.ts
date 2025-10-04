"use server";
import { db } from "@/drizzle/drizzle-db";
import { and, eq, gte, lte } from "drizzle-orm";
import { clients, spentTimes } from "@/drizzle/schema";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleServerErrors } from "@/utils/server-action-utils";

const kClientGetOneAction = async ({
  id,
  date = new Date(),
}: {
  id: string;
  date?: Date;
}) => {
  const queryResult = await db.query.clients.findFirst({
    where: eq(clients.id, parseInt(id)),
    with: {
      projects: {
        with: {
          teams: {
            with: {
              employee: true,
            },
          },
          projectMedias: true,
          tasks: {
            with: {
              spentTimes: {
                where: and(
                  gte(
                    spentTimes.date,
                    format(startOfMonth(date), "yyyy-MM-dd")
                  ),
                  lte(spentTimes.date, format(endOfMonth(date), "yyyy-MM-dd"))
                ),
              },
            },
          },
        },
      },
    },
  });

  if (!queryResult) {
    throw new Error("Client not found");
  }

  const allTimeTasksCount = queryResult?.projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );
  const projects = queryResult?.projects.map((project) => ({
    ...project,
    teams: project.teams.map((team) => ({
      ...team,
      employee: {
        ...team.employee,
        avatarUrl: team.employee.avatarUrl,
      },
    })),
  }));
  return {
    ...queryResult,
    projects,
    avatarUrl: queryResult?.avatarUrl,
    allTimeTasksCount,
  };
};

const handled = handleServerErrors(kClientGetOneAction);
export default handled;

export type KClientGetOneResult = Awaited<
  ReturnType<typeof kClientGetOneAction>
>;
