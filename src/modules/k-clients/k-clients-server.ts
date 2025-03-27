import { KClientRead, KEmployeesRead, KVatRead } from "@/drizzle/drizzle-types";
import kClientsListAllAction from "@/modules/k-clients/actions/k-client-list-all-action";
import kClientGetOneAction from "@/modules/k-clients/actions/k-client-get-one-action";
import kClientGetTasksAndSpentTimesByProjects from "@/modules/k-clients/actions/k-client-get-tasks-and-spent-times-by-projects";
import kClientGetMonthlySpentTimesAction from "@/modules/k-clients/actions/k-client-get-monthly-spent-times-action";
import kClientGetTotalInvoicedAmount from "@/modules/k-clients/actions/k-client-get-total-invoiced-amount";
import kClientGetOverallInvoicedAmount from "@/modules/k-clients/actions/k-client-get-overall-invoiced-amount";

export type KProjectWithTeam = {
  id: number;
  name: string | null;
  team: KEmployeesRead[];
};

export type KClientListItem = KClientRead & {
  projectsCount: number;
  employeesWorkingForClientCount: number;
  kVats: Array<KVatRead>;
  projects: KProjectWithTeam[];
};

export const kClientsServer = {
  listAll: kClientsListAllAction,

  getOne: kClientGetOneAction,

  getTasksAndSpentTimes: kClientGetTasksAndSpentTimesByProjects,
  getMonthlySpentTimes: kClientGetMonthlySpentTimesAction,

  getTotalInvoicedAmount: kClientGetTotalInvoicedAmount,
  getOverallInvoicedAmount: kClientGetOverallInvoicedAmount,
};
