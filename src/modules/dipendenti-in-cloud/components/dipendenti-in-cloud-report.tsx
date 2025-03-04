import {
  eachDayOfInterval,
  getDay,
  format,
  add,
  subHours,
  subMinutes,
  startOfDay,
} from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { it } from "date-fns/locale";
import { KAbsenceDaysList } from "@/modules/k-absence-days/actions/k-absence-days-list";
import { KEmployeesListAllActionResult } from "@/modules/k-employees/actions/k-employee-list-all-action";
import parsePostgresInterval from "postgres-interval";

export type DipendentiInCloudReportProps = {
  from: Date;
  to: Date;
  absences: KAbsenceDaysList;
  uniqueReasons: string[]; // todo rename to uniqueAbsenceReasons
  employees: KEmployeesListAllActionResult;
};

/**
 * Returns the letter corresponding to the day of the week in Italian:
 * 0 (Sunday)    => D
 * 1 (Monday)    => L
 * 2 (Tuesday)   => M
 * 3 (Wednesday) => M
 * 4 (Thursday)  => G
 * 5 (Friday)    => V
 * 6 (Saturday)  => S
 */
function getItalianDayLetter(date: Date): string {
  const dayIndex = getDay(date); // 0=Sunday, 1=Monday, ...
  switch (dayIndex) {
    case 0:
      return "D";
    case 1:
      return "L";
    case 2:
      return "M";
    case 3:
      return "M";
    case 4:
      return "G";
    case 5:
      return "V";
    case 6:
      return "S";
    default:
      return "";
  }
}

const isSaturdayOrSunday = (date: Date): boolean => {
  const day = getDay(date);
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

export default function DipendentiInCloudReport({
  from,
  to,
  employees,
  absences,
  uniqueReasons,
}: DipendentiInCloudReportProps) {
  // Calculate days in the received period
  const daysInMonth = eachDayOfInterval({
    start: from,
    end: to,
  });
  const maxWorkableHoursPerDay = 8;
  const maxWorkableHoursPerPeriod = daysInMonth.reduce((total, day) => {
    if (isSaturdayOrSunday(day)) {
      return total;
    }

    return total + maxWorkableHoursPerDay;
  }, 0);

  // Format month and year label
  const monthYearLabel = format(from, "MMMM yyyy", { locale: it });
  const monthYearLabelCapitalized =
    monthYearLabel.charAt(0).toUpperCase() + monthYearLabel.slice(1);

  return (
    <div className="m-16 space-y-4 text-sm min-w-max">
      <div className="text-end">
        Mese: <strong>{monthYearLabelCapitalized}</strong>
      </div>

      <div className="border-black border text-black flex flex-col">
        <div className="uppercase font-bold py-2 border-black  flex justify-center">
          Ore lavorate
        </div>

        <div className="uppercase border-t border-black flex">
          {/* employee name */}
          <div className="w-[100px] min-w-[100px] py-2 border-r border-black"></div>

          {/* absence reason */}
          <div className="w-[40px] min-w-[40px] py-2 border-r border-black"></div>

          {/* days */}
          {daysInMonth.map((day, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col items-center min-w-[40px] w-[40px] border-r border-black text-xs`}
              >
                <span>{getItalianDayLetter(day)}</span>
                <span>{format(day, "d")}</span>
              </div>
            );
          })}
          <div className="text-end w-[100px]">Totali</div>
        </div>

        {employees.map((employee) => {
          let monthlyTotal = maxWorkableHoursPerPeriod;
          return (
            <div className="uppercase border-t border-black flex">
              {/* employee name */}
              <div className="min-w-[100px] w-[100px] py-2 border-r border-black flex items-center justify-center text-center">
                {employee.name} {employee.surname}
              </div>
              <div className="flex flex-col flex-1">
                {uniqueReasons.map((reason, index) => {
                  let reasonText = reason;
                  if (reason.toLowerCase() === "rol") {
                    reasonText = "ROL";
                  }

                  if (reason.toLowerCase() === "permessi ex festività") {
                    reasonText = "PEF";
                  }

                  if (reason.toLowerCase() === "permessi") {
                    reasonText = "P";
                  }

                  if (reason.toLowerCase() === "donazione sangue") {
                    reasonText = "DS";
                  }

                  return (
                    <div
                      className={`flex ${index > 0 ? "border-t border-black" : ""}`}
                    >
                      <div className="min-w-[40px] w-[40px] py-2 border-r border-black flex items-center justify-center">
                        {reasonText}
                      </div>
                      {/* days */}
                      {daysInMonth.map((day, index) => {
                        if (isSaturdayOrSunday(day)) {
                          const dayOfWeek = getDay(day);
                          const extraClasses =
                            dayOfWeek === 0
                              ? "bg-gray-300"
                              : dayOfWeek === 6
                                ? "bg-gray-200"
                                : "";
                          return (
                            <div
                              key={index}
                              className={`${extraClasses} min-w-[60p] w-[40px] border-r border-black`}
                            ></div>
                          );
                        }

                        const employeeAbsences = absences.filter(
                          ({ k_employees, k_absence_days }) => {
                            return (
                              k_employees?.id === employee.id &&
                              k_absence_days.date ===
                                format(day, "yyyy-MM-dd") &&
                              k_absence_days.description === reason
                            );
                          },
                        );

                        const hoursAndMinutes = employeeAbsences.reduce(
                          (total, { k_absence_days: absence }) => {
                            const { hours, minutes } = parsePostgresInterval(
                              absence?.duration ?? "",
                            );

                            return {
                              hours: total.hours + hours,
                              minutes: total.minutes + minutes,
                            };
                          },
                          { hours: 0, minutes: 0 },
                        );
                        const { hours, minutes } = parsePostgresInterval(
                          `${hoursAndMinutes.hours}:${hoursAndMinutes.minutes}:00`,
                        );
                        monthlyTotal -= hours;
                        // minutes to hours
                        const extraHours = Math.floor(minutes / 60);
                        monthlyTotal -= extraHours;
                        return (
                          <div
                            key={index}
                            className={`flex flex-col justify-center items-center min-w-[40px] w-[40px] border-r border-black text-xs`}
                          >
                            {(hours > 0 || minutes > 0) && (
                              <>
                                {hours > 0 && `${hours}h`}{" "}
                                {minutes > 0 && `${minutes}m`}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                <div className={`flex border-t border-black`}>
                  <div className="min-w-[40px] w-[40px] py-2 border-r border-black"></div>
                  {daysInMonth.map((day, index) => {
                    const employeeAbsences = absences.filter(
                      ({ k_employees, k_absence_days }) => {
                        return (
                          k_employees?.id === employee.id &&
                          k_absence_days.date === format(day, "yyyy-MM-dd")
                        );
                      },
                    );
                    const { hours, minutes } = employeeAbsences.reduce(
                      (total, { k_absence_days: absence }) => {
                        const { hours, minutes } = parsePostgresInterval(
                          absence?.duration ?? "",
                        );

                        return {
                          hours: total.hours + hours,
                          minutes: total.minutes + minutes,
                        };
                      },
                      { hours: 0, minutes: 0 },
                    );
                    const date = startOfDay(new Date());
                    const maxDuration = { hours: maxWorkableHoursPerDay };
                    const baseDate = add(date, maxDuration);
                    const baseDateMinusHours = subHours(baseDate, hours);
                    const baseDateMinusMinutes = subMinutes(
                      baseDateMinusHours,
                      minutes,
                    );

                    if (isSaturdayOrSunday(day)) {
                      const dayOfWeek = getDay(day);
                      const extraClasses =
                        dayOfWeek === 0
                          ? "bg-gray-300"
                          : dayOfWeek === 6
                            ? "bg-gray-200"
                            : "";
                      return (
                        <div
                          key={index}
                          className={`${extraClasses} min-w-[40px] w-[40px] border-r border-black`}
                        ></div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className={`min-w-[40px] w-[40px] border-r border-black text-xs flex items-center justify-center py-2`}
                      >
                        {format(baseDateMinusMinutes, "HH:mm")}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 text-end w-[100px] items-center flex justify-center">
                {monthlyTotal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
