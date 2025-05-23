"use server";
import { db } from "@/drizzle/drizzle-db";
import { kProjects } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

import parsePostgresInterval from "postgres-interval";
import { handleServerErrors } from "@/utils/server-action-utils";
import { getAllClientSpentTimesByProjectAndDateQuery } from "@/modules/k-clients/utils/get-all-client-spent-times-by-project-and-date";
import { unstable_cache } from "next/cache";

// Returns a list of spent times for a client, grouped by date
const kClientGetMonthlySpentTimesAction = async (
  clientId: number,
  date: Date = new Date(),
) => {
  const cached = unstable_cache(
    async () => {
      const projectIds = await db
        .select({ id: kProjects.id })
        .from(kProjects)
        .where(eq(kProjects.clientId, clientId));

      const queryResult = await getAllClientSpentTimesByProjectAndDateQuery(
        projectIds.map((it) => it.id),
        date,
      );

      if (!queryResult || queryResult.length === 0) {
        return [];
      }

      const allSpentTimes = queryResult.map((it) => it.kSpentTimes).flat();
      const reduced: Map<string, number> = allSpentTimes.reduce<
        Map<string, number>
      >((acc, spentTime) => {
        if (!spentTime.date || !spentTime.duration) {
          return acc;
        }
        if (!acc.has(spentTime.date)) {
          acc.set(spentTime.date, 0);
        }

        const parsedDuration = parsePostgresInterval(spentTime.duration);
        const { days, hours, minutes } = parsedDuration;
        const minutesInHours = Math.floor(minutes / 60);
        const daysInHours = days * 8;

        const currentValue = acc.get(spentTime.date) ?? 0;
        acc.set(
          spentTime.date,
          currentValue + daysInHours + hours + minutesInHours,
        );

        return acc;
      }, new Map());

      return Array.from(reduced.entries()).map(([date, duration]) => ({
        date,
        duration,
      }));
    },
    [clientId.toString(), date.toISOString()],
    {
      revalidate: 60 * 60 * 24,
      tags: ["kClientGetMonthlySpentTimesAction"],
    },
  );

  return cached();
};

const handled = handleServerErrors(kClientGetMonthlySpentTimesAction);
export default handled;
