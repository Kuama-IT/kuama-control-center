import listAllEmployees from "@/modules/employees/actions/employee-list-all-action";
import getEmployeeById from "@/modules/employees/actions/employee-by-id-action";
import deleteEmployee from "@/modules/employees/actions/employee-delete-action";

export const employeesServer = {
  listAll: listAllEmployees,
  byId: getEmployeeById,
  deleteEmployee,
};
