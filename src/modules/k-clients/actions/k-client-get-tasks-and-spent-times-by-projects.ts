import { db } from "@/drizzle/drizzle-db";
import { and, gte, lte } from "drizzle-orm";
import { kSpentTimes, kTasks } from "@/drizzle/schema";
import { endOfMonth, format, formatDuration, startOfMonth } from "date-fns";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import parsePostgresInterval from "postgres-interval";

export const getAllClientSpentTimesByProjectAndDateQuery = (
  projectIds: number[],
  date: Date,
) => {
  return db.query.kTasks.findMany({
    with: {
      kSpentTimes: {
        where: and(
          gte(kSpentTimes.date, format(startOfMonth(date), "yyyy-MM-dd")),
          lte(kSpentTimes.date, format(endOfMonth(date), "yyyy-MM-dd")),
        ),
      },
    },
    where: and(inArray(kTasks.projectId, projectIds)),
  });
};

export const kClientGetTasksAndSpentTimesByProjects = async (
  projectIds: number[],
  date: Date,
) => {
  const queryResult = await getAllClientSpentTimesByProjectAndDateQuery(
    projectIds,
    date,
  );

  if (!queryResult || queryResult.length === 0) {
    return {
      humanReadableDuration: "0 minutes",
      spentTimes: [],
    };
  }

  const tasksCount = queryResult.length;

  // TODO: group by project?
  const initialDuration = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  const monthSpentTime = queryResult.reduce(
    (acc, task) => {
      const taskSpentTime = task.kSpentTimes.reduce(
        (acc, spentTime) => {
          if (!spentTime.duration) {
            return acc;
          }
          const parsedDuration = parsePostgresInterval(spentTime.duration);

          return {
            years: acc.years + parsedDuration.years,
            months: acc.months + parsedDuration.months,
            days: acc.days + parsedDuration.days,
            hours: acc.hours + parsedDuration.hours,
            minutes: acc.minutes + parsedDuration.minutes,
            seconds: acc.seconds + parsedDuration.seconds,
            milliseconds: acc.milliseconds + parsedDuration.milliseconds,
          };
        },
        { ...initialDuration },
      );

      return {
        years: acc.years + taskSpentTime.years,
        months: acc.months + taskSpentTime.months,
        days: acc.days + taskSpentTime.days,
        hours: acc.hours + taskSpentTime.hours,
        minutes: acc.minutes + taskSpentTime.minutes,
        seconds: acc.seconds + taskSpentTime.seconds,
        milliseconds: acc.milliseconds + taskSpentTime.milliseconds,
      };
    },
    { ...initialDuration },
  );

  // fetch all related client project
  // for each project, fetch all employees working on it
  // for each project, fetch all tasks
  // for each task, fetch all spent times
  const { days, hours, minutes } = monthSpentTime;

  // normalize
  const numberOfHours = minutes / 60;
  const remainingMinutes = minutes % 60;

  const numberOfDays = (hours + numberOfHours) / 8;
  const remainingHours = (hours + 8) % 24;
  const humanReadableDuration = formatDuration(
    {
      days: Math.ceil(numberOfDays + days),
      hours: Math.ceil(remainingHours),
      minutes: Math.ceil(remainingMinutes),
    },
    {
      format: ["days", "hours", "minutes"],
    },
  );
  return {
    humanReadableDuration,
    monthSpentTime,
    spentTimes: queryResult,
  };
};
