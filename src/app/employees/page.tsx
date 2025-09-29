import { EmployeesWithPayrolls } from "@/modules/k-employees/components/employees-with-payrolls";
import { employeesService } from "@/modules/k-employees/employees.service";

export default async function Page() {
  const data = await employeesService.allWithPayrolls();

  return <EmployeesWithPayrolls employees={data} />;
}
