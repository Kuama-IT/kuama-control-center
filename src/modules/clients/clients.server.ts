import {
  getMonthlySpentTimesAction,
  getOneAction,
  getOverallInvoicedAmountAction,
  getTasksAndSpentTimesAction,
  getTotalInvoicedAmountAction,
  listAllAction,
} from "./clients.actions";
import type { ClientRead, VatRead } from "./schemas/clients-schemas";
import type { KEmployeesRead } from "@/modules/employees/schemas/employees-schemas";

export type ProjectWithTeam = {
  id: number;
  name: string | null;
  team: KEmployeesRead[];
};

export type ClientListItem = ClientRead & {
  projectsCount: number;
  employeesWorkingForClientCount: number;
  vats: Array<VatRead>;
  projects: ProjectWithTeam[];
};

export const clientsServer = {
  listAll: listAllAction as unknown as () => Promise<ClientListItem[]>,
  getOne: getOneAction,
  getTasksAndSpentTimes: getTasksAndSpentTimesAction,
  getMonthlySpentTimes: getMonthlySpentTimesAction,
  getTotalInvoicedAmount: getTotalInvoicedAmountAction,
  getOverallInvoicedAmount: getOverallInvoicedAmountAction,
};
