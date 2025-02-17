"use server";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kEmployees } from "@/drizzle/schema";
import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { z } from "zod";
import { format } from "date-fns";
import { handleServerErrors } from "@/utils/server-action-utils";

export default handleServerErrors(
  async ({ from, to }: { from: Date; to: Date }) => {
    const employees = await db
      .select({ id: kEmployees.dipendentiInCloudId })
      .from(kEmployees)
      .where(isNotNull(kEmployees.dipendentiInCloudId));

    // remove kAbsenceDays for the given range
    await db
      .delete(kAbsenceDays)
      .where(
        and(
          gte(kAbsenceDays.date, format(from, "yyyy-MM-dd")),
          lte(kAbsenceDays.date, format(to, "yyyy-MM-dd")),
        ),
      );

    const timesheet = await dipendentiInCloudApiClient.getMonthlyTimesheet(
      from,
      to,
      z.array(z.object({ id: z.string() })).parse(employees),
    );

    for (const [dipendentiInCloudId, days] of Object.entries(timesheet)) {
      for (const [date, timesheetEntry] of Object.entries(days)) {
        if (!timesheetEntry) {
          continue;
        }
        if (
          timesheetEntry.closed ||
          timesheetEntry.disabled ||
          !timesheetEntry.reasons ||
          timesheetEntry.reasons.length === 0
        ) {
          continue;
        }

        const res = await db
          .select({ id: kEmployees.id })
          .from(kEmployees)
          .where(eq(kEmployees.dipendentiInCloudId, dipendentiInCloudId));

        await db.insert(kAbsenceDays).values(
          timesheetEntry.reasons
            .map(({ reason, shifts, duration, duration_pending }) => {
              return (
                shifts?.map((shift) => {
                  return {
                    date,
                    employeeId: res[0].id,
                    description: reason.name,
                    duration: `${shift.duration ?? shift.duration_pending} minute`,
                    pending: shift.duration_pending !== null,
                    timeStart: shift.time_start,
                    timeEnd: shift.time_end,
                  };
                }) ?? [
                  {
                    date,
                    employeeId: res[0].id,
                    description: reason.name,
                    duration: `${duration ?? duration_pending} minute`,
                    pending: duration_pending !== null,
                    timeStart: "08:00:00",
                    timeEnd: "18:00:00",
                  },
                ]
              );
            })
            .flat(),
        );
      }
    }
  },
);
