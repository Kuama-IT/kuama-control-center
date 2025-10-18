import { endOfMonth, format, startOfMonth } from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { db } from "@/drizzle/drizzle-db";
import { spentTimes, tasks } from "@/drizzle/schema";

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
