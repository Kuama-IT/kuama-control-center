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
      kProjects: {
        with: {
          kTeams: {
            with: {
              kEmployee: true,
            },
          },
          kProjectMedias: true,
          kTasks: {
            with: {
              kSpentTimes: {
                where: and(
                  gte(
                    kSpentTimes.date,
                    format(startOfMonth(date), "yyyy-MM-dd"),
                  ),
                  lte(kSpentTimes.date, format(endOfMonth(date), "yyyy-MM-dd")),
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

  const allTimeTasksCount = queryResult?.kProjects.reduce(
    (acc, project) => acc + project.kTasks.length,
    0,
  );
  const kProjects = queryResult?.kProjects.map((project) => ({
    ...project,
    kTeams: project.kTeams.map((team) => ({
      ...team,
      kEmployee: {
        ...team.kEmployee,
        avatarUrl: team.kEmployee.avatarUrl,
      },
    })),
  }));
  return {
    ...queryResult,
    kProjects,
    avatarUrl: queryResult?.avatarUrl,
    allTimeTasksCount,
  };
};

const handled = handleServerErrors(kClientGetOneAction);
export default handled;

export type KClientGetOneResult = Awaited<
  ReturnType<typeof kClientGetOneAction>
>;
