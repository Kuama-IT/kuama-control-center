import { KClientRead } from "@/drizzle/drizzle-types";
import { kClientsListAllAction } from "@/modules/k-clients/actions/k-client-list-all-action";
import { kClientGetOneAction } from "@/modules/k-clients/actions/k-client-get-one-action";
import { kClientGetTasksAndSpentTimesByProjects } from "@/modules/k-clients/actions/k-client-get-tasks-and-spent-times-by-projects";
import { kClientGetMonthlySpentTimesAction } from "@/modules/k-clients/actions/k-client-get-monthly-spent-times-action";

export type KClientListItem = KClientRead & {
  projectsCount: number;
  employeesWorkingForClientCount: number;
};

export const kClientsServer = {
  listAll: kClientsListAllAction,

  getOne: kClientGetOneAction,

  getTasksAndSpentTimes: kClientGetTasksAndSpentTimesByProjects,
  getMonthlySpentTimes: kClientGetMonthlySpentTimesAction,
};
