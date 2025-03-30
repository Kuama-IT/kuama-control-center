import { eachDayOfInterval, format, getDay } from "date-fns";
import { it } from "date-fns/locale";
import { KAbsenceDaysList } from "@/modules/k-absence-days/actions/k-absence-days-list";
import { KEmployeesListAllActionResult } from "@/modules/k-employees/actions/k-employee-list-all-action";
import parsePostgresInterval from "postgres-interval";
import { KAbsenceReasonList } from "@/modules/k-absence-days/actions/k-absence-reasons-list";
import { KClosuresList } from "@/modules/k-absence-days/actions/k-closures-list";
import { ChronoUnit, Duration } from "@js-joda/core";

export type DipendentiInCloudReportProps = {
  from: Date;
  to: Date;
  absences: KAbsenceDaysList;
  uniqueAbsenceReasons: string[];
  employees: KEmployeesListAllActionResult;
  absenceReasons: KAbsenceReasonList;
  closures: KClosuresList;
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
export function getItalianDayLetter(date: Date): string {
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

export type MonthDayItem = {
  isSaturday: boolean;
  isSunday: boolean;
  isClosure: boolean;
  isWeekend: boolean;
  isClosureOrWeekend: boolean;
  date: Date;
  formattedDate: string;
};

const toMonthDayItem = (date: Date, closures: KClosuresList) => {
  const day = getDay(date);
  const isSaturday = day === 6;
  const isSunday = day === 0;
  const isClosure = closures.some((closure) => {
    return closure.date === date;
  });

  return {
    isSaturday,
    isSunday,
    isClosure,
    isWeekend: isSaturday || isSunday,
    isClosureOrWeekend: isSaturday || isSunday || isClosure,
    date,
    formattedDate: format(date, "yyyy-MM-dd"),
  };
};

const maxWorkableHoursPerDay = 8;

export const getReportTitle = (date: Date) => {
  // Format month and year label
  const monthYearLabel = format(date, "MMMM yyyy", { locale: it });
  return monthYearLabel.charAt(0).toUpperCase() + monthYearLabel.slice(1);
};

const getDaysForPeriod = ({
  from,
  to,
  closures,
}: {
  from: Date;
  to: Date;
  closures: KClosuresList;
}) => {
  // Calculate days in the received period
  const daysInMonth = eachDayOfInterval({
    start: from,
    end: to,
  });

  const month = daysInMonth.map((day) => toMonthDayItem(day, closures));

  const maxWorkableHoursPerPeriod = month.reduce((total, day) => {
    if (day.isClosureOrWeekend) {
      return total;
    }

    return total + maxWorkableHoursPerDay;
  }, 0);
  return {
    month,
    maxWorkableHoursPerPeriod,
  };
};

export type UIDay = MonthDayItem & { label: string };

type ReportReasonRow = {
  code: string;
  days: UIDay[];
};

export type ReportRow = {
  employeeName: string;
  employeeNationalInsuranceNumber: string | null;
  reasons: ReportReasonRow[];
  totals: UIDay[];
  monthlyTotal: Duration;
  monthlyTotalLabel: string;
};

export const getDataForReport = ({
  from,
  to,
  employees,
  absences,
  uniqueAbsenceReasons,
  closures,
}: DipendentiInCloudReportProps) => {
  const { month, maxWorkableHoursPerPeriod } = getDaysForPeriod({
    from,
    to,
    closures,
  });
  const rows: ReportRow[] = [];

  const absencesByEmployee = absences.reduce((acc, absence) => {
    const employeeId = absence.k_employees?.id;
    if (!employeeId) {
      return acc;
    }
    if (!acc.has(employeeId)) {
      acc.set(employeeId, []);
    }

    const { hours, minutes } = parsePostgresInterval(
      absence.k_absence_days?.duration ?? "",
    );

    acc.get(employeeId)?.push({
      duration: absence.k_absence_days?.duration ?? "",
      hours,
      minutes,
      reasonCode: absence.k_absence_days?.reasonCode ?? "",
      date: absence.k_absence_days?.date ?? "",
    });
    return acc;
  }, new Map<number, { date: string; hours: number; minutes: number; duration: string; reasonCode: string }[]>());

  for (const employee of employees) {
    const item: ReportRow = {
      employeeName: `${employee.name} ${employee.surname}`,
      employeeNationalInsuranceNumber: employee.nationalInsuranceNumber,
      reasons: [],
      totals: [],
      monthlyTotal: Duration.of(maxWorkableHoursPerPeriod, ChronoUnit.HOURS),
      monthlyTotalLabel: "",
    };

    const absencesForEmployee = absencesByEmployee.get(employee.id);

    const dayMap = new Map<string, Duration>();
    for (const day of month) {
      dayMap.set(
        day.formattedDate,
        Duration.of(maxWorkableHoursPerDay, ChronoUnit.HOURS),
      );
    }
    for (const reason of uniqueAbsenceReasons) {
      const reasonItem: ReportReasonRow = {
        code: reason,
        days: [],
      };

      for (const day of month) {
        const absencesDayForReason = absencesForEmployee?.filter(
          (it) => it.reasonCode === reason && it.date === day.formattedDate,
        );

        const { hours, minutes } = absencesDayForReason?.reduce(
          (total, { hours, minutes }) => {
            return {
              hours: total.hours + hours,
              minutes: total.minutes + minutes,
            };
          },
          { hours: 0, minutes: 0 },
        ) ?? { hours: 0, minutes: 0 };

        // compute label and subtract hours and minutes from totalDayDuration and monthlyTotal
        let dayLabel = "";
        let totalDayDuration = dayMap.get(day.formattedDate);
        if (hours > 0) {
          dayLabel += `${hours}h`;
          item.monthlyTotal = item.monthlyTotal.minusHours(hours);

          if (totalDayDuration) {
            totalDayDuration = totalDayDuration?.minusHours(hours);
          }
        }
        if (minutes > 0) {
          dayLabel += `${minutes}m`;
          item.monthlyTotal = item.monthlyTotal.minusMinutes(minutes);
          if (totalDayDuration) {
            totalDayDuration = totalDayDuration.minusMinutes(minutes);
          }
        }

        if (totalDayDuration) {
          dayMap.set(day.formattedDate, totalDayDuration);
        }

        reasonItem.days.push({ ...day, label: dayLabel });
      }

      item.reasons.push(reasonItem);
    }

    for (const day of month) {
      const dayTotalDuration = dayMap.get(day.formattedDate);
      if (!dayTotalDuration) {
        item.totals.push({ ...day, label: "" });
        continue;
      }
      const totalMinutes = dayTotalDuration.toMinutes();
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      let totalLabel = "";
      if (hours > 0) {
        totalLabel += `${hours}h`;
      }
      if (minutes > 0) {
        totalLabel += `${minutes}m`;
      }
      item.totals.push({ ...day, label: totalLabel });
    }

    const totalMinutes = item.monthlyTotal.toMinutes();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let totalLabel = "";
    if (hours > 0) {
      totalLabel += `${hours}h`;
    }
    if (minutes > 0) {
      totalLabel += `${minutes}m`;
    }

    item.monthlyTotalLabel = totalLabel;

    rows.push(item);
  }

  return { rows, month };
};
