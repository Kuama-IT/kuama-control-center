"use server";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { db } from "@/drizzle/drizzle-db";
import { kAbsenceDays, kEmployees } from "@/drizzle/schema";
import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { z } from "zod";
import { format } from "date-fns";

export default async function syncDipendentiInCloudTimesheet({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) {
  const employees = await db
    .select({ id: kEmployees.dipendentiInCloudId })
    .from(kEmployees)
    .where(isNotNull(kEmployees.dipendentiInCloudId));

  // remove kAbsenceDays for the given range
  db.delete(kAbsenceDays).where(
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
        timesheetEntry.reasons.map((reason) => ({
          date,
          employeeId: res[0].id,
          description: reason.reason.name,
          duration: `${reason.duration} minute`,
        })),
      );
    }
  }
}
