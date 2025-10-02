"use server";
import { db } from "@/drizzle/drizzle-db";
import { and, eq, gte, lte } from "drizzle-orm";
import { kClients, kSpentTimes } from "@/drizzle/schema";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { handleServerErrors } from "@/utils/server-action-utils";

const kClientGetOneAction = async ({
  id,
  date = new Date(),
}: {
  id: string;
  date?: Date;
}) => {
  const queryResult = await db.query.kClients.findFirst({
    where: eq(kClients.id, parseInt(id)),
    with: {
      projects: {
        with: {
          teams: {
            with: {
              employee: true,
            },
          },
          projectMedias: true,
          kTasks: {
            with: {
              kSpentTimes: {
                where: and(
                  gte(
                    kSpentTimes.date,
                    format(startOfMonth(date), "yyyy-MM-dd")
                  ),
                  lte(kSpentTimes.date, format(endOfMonth(date), "yyyy-MM-dd"))
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
    (acc, project) => acc + project.kTasks.length,
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
