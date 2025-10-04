import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
} from "date-fns";
import { KEmployeeAvatar } from "@/modules/employees/components/k-employee-avatar";
import parsePostgresInterval from "postgres-interval";
import { Title } from "@/modules/ui/components/title";
import { timesheetsAbsenceServer } from "@/modules/timesheets/timesheets-absence.server";
import type { AbsenceDaysList } from "@/modules/timesheets/schemas";

const getCurrentWeekDays = () => {
  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());

  return eachDayOfInterval({ start, end });
};

export default async function WeeklyAbsence() {
  const weekDays = getCurrentWeekDays();
  let absences: AbsenceDaysList = [];
  try {
    absences = await timesheetsAbsenceServer.list({
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
        {weekDays.map((date, index) => (
          <div className={`flex flex-col gap-4 rounded-lg`} key={index}>
            <div className="flex flex-col px-4 py-2 min-w-52 bg-accent rounded-lg items-center">
              <span className="uppercase text-sm">{format(date, "iii")}</span>
              <span
                className={`text-lg font-bold w-fit aspect-square rounded-full flex items-center justify-center ${isToday(date) ? "bg-foreground text-background text-sm p-1" : ""}`}
              >
                {format(date, "dd")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {absences
                .filter((absenceEntry) => {
                  const record = absenceEntry?.absence_days;
                  return record?.date === format(date, "yyyy-MM-dd");
                })
                .map((absenceEntry, index) => {
                  const { absence_days: absence, employees: employee } =
                    absenceEntry;
                  const { hours, minutes } = parsePostgresInterval(
                    absence?.duration ?? "",
                  );
                  const timeStart = parsePostgresInterval(
                    absence?.timeStart ?? "",
                  );
                  const timeEnd = parsePostgresInterval(
                    absence?.timeEnd ?? "",
                  );
                  return (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <KEmployeeAvatar employee={employee!} />
                      <div className="flex flex-col gap-2">
                        {absence?.duration && (
                          <span className="font-bold">
                            {hours}h {minutes}m
                          </span>
                        )}
                        <span className="text-xs">
                          {String(timeStart.hours).padStart(2, "0")}:
                          {String(timeStart.minutes).padStart(2, "0")} - {String(timeEnd.hours).padStart(2, "0")}:
                          {String(timeEnd.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-xs">{absence?.description}</span>
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
