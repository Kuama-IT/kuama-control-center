import kEmployeeListAll from "@/modules/k-employees/actions/k-employee-list-all-action";
import kEmployeeById from "@/modules/k-employees/actions/k-employee-by-id-action";

export const kEmployeesServer = {
  listAll: kEmployeeListAll,
  byId: kEmployeeById,
};
