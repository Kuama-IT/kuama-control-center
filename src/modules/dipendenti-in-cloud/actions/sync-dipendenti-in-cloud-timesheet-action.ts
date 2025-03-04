"use server";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kEmployees, kPresenceDays } from "@/drizzle/schema";
import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { z } from "zod";
import { format } from "date-fns";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";

const syncTimesheet = async ({ from, to }: { from: Date; to: Date }) => {
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

  // remove kPresenceDays for the given range
  await db
    .delete(kPresenceDays)
    .where(
      and(
        gte(kPresenceDays.date, format(from, "yyyy-MM-dd")),
        lte(kPresenceDays.date, format(to, "yyyy-MM-dd")),
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
      if (timesheetEntry.closed || timesheetEntry.disabled) {
        continue;
      }

      const res = await db
        .select({ id: kEmployees.id, name: kEmployees.name })
        .from(kEmployees)
        .where(eq(kEmployees.dipendentiInCloudId, dipendentiInCloudId));
      if (res.length === 0) {
        // an ex employee, we can skip...
        continue;
      }
      const { id: employeeId, name: employeeName } = firstOrThrow(res);

      if (timesheetEntry.reasons && timesheetEntry.reasons.length > 0) {
        await db.insert(kAbsenceDays).values(
          timesheetEntry.reasons
            .map(({ reason, shifts, duration, duration_pending }) => {
              console.log(employeeName, reason.name);
              return (
                shifts?.map((shift) => {
                  return {
                    date,
                    employeeId,
                    description: reason.name,
                    duration: `${shift.duration ?? shift.duration_pending} minute`,
                    pending: shift.duration_pending !== null,
                    timeStart: shift.time_start,
                    timeEnd: shift.time_end,
                  };
                }) ?? [
                  {
                    date,
                    employeeId,
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

      if (timesheetEntry.presence) {
        await db.insert(kPresenceDays).values({
          date,
          employeeId,
          duration: `${timesheetEntry.presence.duration} minute`,
        });
      }
    }
  }
};

const handled = handleServerErrors(syncTimesheet);

export default handled;
