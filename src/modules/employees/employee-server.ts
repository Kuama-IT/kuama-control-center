import { employeesServer } from "./employees.server";

export const employeesApi = {
  listAll: employeesServer.listAll,
  byId: employeesServer.byId,
  deleteEmployee: employeesServer.deleteEmployee,
};
