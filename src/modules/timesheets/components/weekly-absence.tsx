import {
    eachDayOfInterval,
    endOfWeek,
    format,
    isToday,
    startOfWeek,
} from "date-fns";
import parsePostgresInterval from "postgres-interval";
import { EmployeeAvatar } from "@/modules/employees/components/employee-avatar";
import { type AbsenceDaysList } from "@/modules/timesheets/schemas/absence-types";
import { timesheetsServer } from "@/modules/timesheets/timesheets.server";
import { Title } from "@/modules/ui/components/title";

const getCurrentWeekDays = () => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());

    return eachDayOfInterval({ start, end });
};

export default async function WeeklyAbsence() {
    const weekDays = getCurrentWeekDays();
    let absences: AbsenceDaysList = [];
    try {
        absences = await timesheetsServer.absenceDaysAll({
            from: weekDays[0],
            to: weekDays[weekDays.length - 1],
        });
    } catch (error) {
        console.error(error);
        return "Could not load absences";
    }

    if (absences.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <Title>Team members absent this week</Title>
                <p>Everybody is present 🎉🎉🎉🎉</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2">
            <Title>Team members absent this week</Title>
            <div className="flex gap-2">
                {weekDays.map((date) => (
                    <div
                        className={`flex flex-col gap-4 rounded-lg`}
                        key={date.toISOString()}
                    >
                        <div className="flex min-w-52 flex-col items-center rounded-lg bg-accent px-4 py-2">
                            <span className="text-sm uppercase">
                                {format(date, "iii")}
                            </span>
                            <span
                                className={`flex aspect-square w-fit items-center justify-center rounded-full font-bold text-lg ${isToday(date) ? "bg-foreground p-1 text-background text-sm" : ""}`}
                            >
                                {format(date, "dd")}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {absences
                                .filter((absenceEntry) => {
                                    const record = absenceEntry?.absence_days;
                                    return (
                                        record?.date ===
                                        format(date, "yyyy-MM-dd")
                                    );
                                })
                                .map((absenceEntry) => {
                                    const {
                                        absence_days: absence,
                                        employees: employee,
                                    } = absenceEntry;
                                    const { hours, minutes } =
                                        parsePostgresInterval(
                                            absence?.duration ?? "",
                                        );
                                    const timeStart = parsePostgresInterval(
                                        absence?.timeStart ?? "",
                                    );
                                    const timeEnd = parsePostgresInterval(
                                        absence?.timeEnd ?? "",
                                    );
                                    return (
                                        <div
                                            key={`${employee?.id}-${timeStart}-${timeEnd}`}
                                            className="flex gap-4 rounded-lg border p-4"
                                        >
                                            <EmployeeAvatar
                                                avatarUrl={employee?.avatarUrl}
                                                fullName={employee?.fullName}
                                            />
                                            <div className="flex flex-col gap-2">
                                                {absence?.duration && (
                                                    <span className="font-bold">
                                                        {hours}h {minutes}m
                                                    </span>
                                                )}
                                                <span className="text-xs">
                                                    {String(
                                                        timeStart.hours,
                                                    ).padStart(2, "0")}
                                                    :
                                                    {String(
                                                        timeStart.minutes,
                                                    ).padStart(2, "0")}{" "}
                                                    -{" "}
                                                    {String(
                                                        timeEnd.hours,
                                                    ).padStart(2, "0")}
                                                    :
                                                    {String(
                                                        timeEnd.minutes,
                                                    ).padStart(2, "0")}
                                                </span>
                                                <span className="text-xs">
                                                    {absence?.description}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
