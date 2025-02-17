import { db } from "@/drizzle/drizzle-db";
import { and, gte, lte } from "drizzle-orm";
import { kSpentTimes, kTasks } from "@/drizzle/schema";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

export const getAllClientSpentTimesByProjectAndDateQuery = (
  projectIds: number[],
  date: Date,
) => {
  return db.query.kTasks.findMany({
    with: {
      kSpentTimes: {
        where: and(
          gte(kSpentTimes.date, format(startOfMonth(date), "yyyy-MM-dd")),
          lte(kSpentTimes.date, format(endOfMonth(date), "yyyy-MM-dd")),
        ),
      },
    },
    where: inArray(kTasks.projectId, projectIds),
  });
};
