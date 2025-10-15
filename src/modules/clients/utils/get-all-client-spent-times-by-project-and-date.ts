import { db } from "@/drizzle/drizzle-db";
import { and, gte, lte } from "drizzle-orm";
import { spentTimes, tasks } from "@/drizzle/schema";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

export const getAllClientSpentTimesByProjectAndDateQuery = (
    projectIds: number[],
    date: Date,
) => {
    return db.query.tasks.findMany({
        with: {
            spentTimes: {
                where: and(
                    gte(
                        spentTimes.date,
                        format(startOfMonth(date), "yyyy-MM-dd"),
                    ),
                    lte(
                        spentTimes.date,
                        format(endOfMonth(date), "yyyy-MM-dd"),
                    ),
                ),
            },
        },
        where: inArray(tasks.projectId, projectIds),
    });
};
