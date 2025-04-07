"use server";
import { formatDuration } from "date-fns";
import parsePostgresInterval from "postgres-interval";
import { handleServerErrors } from "@/utils/server-action-utils";
import { getAllClientSpentTimesByProjectAndDateQuery } from "@/modules/k-clients/utils/get-all-client-spent-times-by-project-and-date";
import { unstable_cache } from "next/cache";

const kClientGetTasksAndSpentTimesByProjects = async ({
  projectIds,
  date,
}: {
  projectIds: number[];
  date: Date;
}) => {
  const cached = unstable_cache(
    async () => {
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
    },
    [...projectIds.map((it) => it.toString()), date.toISOString()],
    {
      revalidate: 60 * 8 * 24,
      tags: ["kClientGetTasksAndSpentTimesByProjects"],
    },
  );

  return cached();
};

const handled = handleServerErrors(kClientGetTasksAndSpentTimesByProjects);
export default handled;
