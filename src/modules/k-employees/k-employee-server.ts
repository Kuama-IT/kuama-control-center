import kEmployeeListAll from "@/modules/k-employees/actions/k-employee-list-all-action";
import kEmployeeById from "@/modules/k-employees/actions/k-employee-by-id-action";
import deleteKEmployee from "@/modules/k-employees/actions/k-employee-delete-action";

export const kEmployeesServer = {
  listAll: kEmployeeListAll,
  byId: kEmployeeById,
  deleteEmployee: deleteKEmployee,
};
