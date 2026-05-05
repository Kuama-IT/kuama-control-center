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
  const extractTimePart = (
    dateTime: string | null | undefined,
    fallback: string,
  ) => {
    if (!dateTime) {
      return fallback;
    }

    const timePart = dateTime.includes(" ") ? dateTime.split(" ")[1] : dateTime;
    return timePart || fallback;
  };

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
      // Skip non-working days
      if (!timesheetEntry.working_day) {
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

      if (
        timesheetEntry.justifications &&
        timesheetEntry.justifications.length > 0
      ) {
        const absencesToInsert = timesheetEntry.justifications.map(
          (justification) => {
            const timeStart = extractTimePart(
              justification.time_start ?? justification.pending_time_start,
              "08:00:00",
            );
            const timeEnd = extractTimePart(
              justification.time_end ?? justification.pending_time_end,
              "18:00:00",
            );

            return {
              date,
              employeeId,
              description: justification.name,
              reasonCode: justification.code,
              duration: `${justification.duration ?? justification.duration_pending ?? 0} minutes`,
              pending: justification.pending === 1,
              timeStart,
              timeEnd,
            };
          },
        );

        if (absencesToInsert.length > 0) {
          console.log(
            `${employeeName}: ${absencesToInsert.length} absences on ${date}`,
          );
          await db.insert(kAbsenceDays).values(absencesToInsert);
        }
      }

      // Handle presence from shifts
      if (timesheetEntry.shifts && timesheetEntry.shifts.length > 0) {
        const totalDuration = timesheetEntry.shifts.reduce(
          (sum, shift) => sum + (shift.duration || 0),
          0,
        );

        if (totalDuration > 0) {
          await db.insert(kPresenceDays).values({
            date,
            employeeId,
            duration: `${totalDuration} minutes`,
          });
        }
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
