"use server";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kEmployees, kPresenceDays } from "@/drizzle/schema";
import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { z } from "zod";
import { eachDayOfInterval, format } from "date-fns";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { revalidateTag } from "next/cache";
import { kAbsenceDaysListCacheTag } from "@/modules/k-absence-days/k-absence-days-cache-tags";

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
                    reasonCode: reason.code,
                    duration: `${shift.duration ?? shift.duration_pending} minutes`,
                    pending: shift.duration_pending !== null,
                    timeStart: shift.time_start,
                    timeEnd: shift.time_end,
                  };
                }) ?? [
                  {
                    date,
                    employeeId,
                    description: reason.name,
                    reasonCode: reason.code,
                    duration: `${duration ?? duration_pending} minutes`,
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
          duration: `${timesheetEntry.presence.duration} minutes`,
        });
      }
    }
  }

  // ensure employee with national insurance number = GRSSRG92H26Z140H has 4 hours of absence each monday inside the from/to period
  const daysOfPeriod = eachDayOfInterval({
    start: from,
    end: to,
  });
  const mondayDays = daysOfPeriod.filter((day) => format(day, "E") === "Mon");
  const employeeRes = await db
    .select()
    .from(kEmployees)
    .where(eq(kEmployees.nationalInsuranceNumber, "GRSSRG92H26Z140H"));

  if (employeeRes.length > 0) {
    const { id } = firstOrThrow(employeeRes);
    for (const monday of mondayDays) {
      const res = await db
        .select()
        .from(kAbsenceDays)
        .where(
          and(
            eq(kAbsenceDays.employeeId, id),
            eq(kAbsenceDays.date, format(monday, "yyyy-MM-dd")),
          ),
        );
      if (res.length === 0) {
        await db.insert(kAbsenceDays).values({
          date: format(monday, "yyyy-MM-dd"),
          employeeId: id,
          reasonCode: "--",
          duration: "240 minutes",
          timeStart: "14:00:00",
          timeEnd: "18:00:00",
        });
      }
    }
  }

  revalidateTag(kAbsenceDaysListCacheTag);
};

const handled = handleServerErrors(syncTimesheet);

export default handled;
