import { eachDayOfInterval, format, parse } from "date-fns";
import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/drizzle/drizzle-db";
import {
    absenceDays,
    absenceReasons,
    closures,
    employees,
    presenceDays,
} from "@/drizzle/schema";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { type AbsenceDaysList } from "@/modules/timesheets/schemas";
import { timesheetsAbsenceDb } from "@/modules/timesheets/timesheets-absence.db";
import { timesheetsClosuresDb } from "@/modules/timesheets/timesheets-closures.db";
import { firstOrThrow } from "@/utils/array-utils";

export const timesheetsServer = {
    async absenceDaysAll({
        from,
        to,
    }: {
        from: Date;
        to: Date;
    }): Promise<AbsenceDaysList> {
        return db
            .select()
            .from(absenceDays)
            .leftJoin(employees, eq(absenceDays.employeeId, employees.id))
            .where(
                and(
                    gte(absenceDays.date, format(from, "yyyy-MM-dd")),
                    lte(absenceDays.date, format(to, "yyyy-MM-dd")),
                ),
            );
    },

    async absenceReasonsAll() {
        const reasons = await timesheetsAbsenceDb.selectAbsenceReasons();

        return [
            ...reasons,
            {
                id: 0,
                name: "Per contratto",
                code: "--",
            },
        ];
    },

    async closuresAll() {
        const closuresFromDb = await timesheetsClosuresDb.selectClosures();
        const currentYear = new Date().getFullYear();

        return closuresFromDb.map((closure) => {
            const { day, month, year = currentYear } = closure;
            const paddedDay = String(day).padStart(2, "0");
            const paddedMonth = String(month).padStart(2, "0");

            return {
                ...closure,
                date: parse(
                    `${paddedDay}-${paddedMonth}-${year}`,
                    "dd-MM-yyyy",
                    new Date(),
                ),
            };
        });
    },

    async syncAbsenceReasonsAndClosuresFromDipendentiInCloud() {
        const absenceReasonsData =
            await dipendentiInCloudApiClient.getAbsenceReasons();
        const closuresData = await dipendentiInCloudApiClient.getClosures();
        await db.transaction(async (tx) => {
            await tx
                .insert(absenceReasons)
                .values(absenceReasonsData)
                .onConflictDoNothing();
            await tx
                .insert(closures)
                .values(
                    closuresData.map(
                        ({ day, month, year, disabled_reason }) => ({
                            day,
                            month,
                            year,
                            description: disabled_reason,
                        }),
                    ),
                )
                .onConflictDoNothing();
        });

        return {
            message: `Imported ${absenceReasonsData.length} absence reasons and ${closuresData.length} closures`,
        };
    },
    async syncPresenceAndAbsenceFromDipendentiInCloud({
        from,
        to,
    }: {
        from: Date;
        to: Date;
    }) {
        const employeesResult = await db
            .select({ id: employees.dipendentiInCloudId })
            .from(employees)
            .where(isNotNull(employees.dipendentiInCloudId));
        // remove absenceDays for the given range
        await db
            .delete(absenceDays)
            .where(
                and(
                    gte(absenceDays.date, format(from, "yyyy-MM-dd")),
                    lte(absenceDays.date, format(to, "yyyy-MM-dd")),
                ),
            );

        // remove presenceDays for the given range
        await db
            .delete(presenceDays)
            .where(
                and(
                    gte(presenceDays.date, format(from, "yyyy-MM-dd")),
                    lte(presenceDays.date, format(to, "yyyy-MM-dd")),
                ),
            );

        const timesheet = await dipendentiInCloudApiClient.getMonthlyTimesheet(
            from,
            to,
            z.array(z.object({ id: z.string() })).parse(employeesResult),
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
                    .select({ id: employees.id, name: employees.name })
                    .from(employees)
                    .where(
                        eq(employees.dipendentiInCloudId, dipendentiInCloudId),
                    );
                if (res.length === 0) {
                    // an ex employee, we can skip...
                    continue;
                }
                const { id: employeeId } = firstOrThrow(res);

                if (
                    timesheetEntry.reasons &&
                    timesheetEntry.reasons.length > 0
                ) {
                    await db.insert(absenceDays).values(
                        timesheetEntry.reasons
                            .map(
                                ({
                                    reason,
                                    shifts,
                                    duration,
                                    duration_pending,
                                }) => {
                                    return (
                                        shifts?.map((shift) => {
                                            return {
                                                date,
                                                employeeId,
                                                description: reason.name,
                                                reasonCode: reason.code,
                                                duration: `${shift.duration ?? shift.duration_pending} minutes`,
                                                pending:
                                                    shift.duration_pending !==
                                                    null,
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
                                                pending:
                                                    duration_pending !== null,
                                                timeStart: "08:00:00",
                                                timeEnd: "18:00:00",
                                            },
                                        ]
                                    );
                                },
                            )
                            .flat(),
                    );
                }

                if (timesheetEntry.presence) {
                    await db.insert(presenceDays).values({
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
        const mondayDays = daysOfPeriod.filter(
            (day) => format(day, "E") === "Mon",
        );
        const employeeRes = await db
            .select()
            .from(employees)
            .where(eq(employees.cf, "GRSSRG92H26Z140H"));

        if (employeeRes.length > 0) {
            const { id } = firstOrThrow(employeeRes);
            for (const monday of mondayDays) {
                const res = await db
                    .select()
                    .from(absenceDays)
                    .where(
                        and(
                            eq(absenceDays.employeeId, id),
                            eq(absenceDays.date, format(monday, "yyyy-MM-dd")),
                        ),
                    );
                if (res.length === 0) {
                    await db.insert(absenceDays).values({
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

        return {
            message: `Presence and absence synced for period from ${format(from, "yyyy-MM-dd")} to ${format(to, "yyyy-MM-dd")}`,
        };
    },
};
