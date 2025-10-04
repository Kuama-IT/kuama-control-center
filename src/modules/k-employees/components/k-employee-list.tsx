import { Title } from "@/modules/ui/components/title";
import { employeesServer } from "@/modules/employees/employees.server";
import { KEmployeeCard } from "@/modules/employees/components/k-employee-card";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function KEmployees() {
  const employees = await employeesServer.listAll();
  if (isFailure(employees)) {
    return <ErrorMessage failure={employees} />;
  }
  return (
    <>
      <Title>Employees ({employees.length})</Title>
      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-3 py-8 items-center">
        {employees.map((employee, index) => (
          <KEmployeeCard
            key={employee.id}
            employee={employee}
            index={index / 10}
          />
        ))}
      </div>
    </>
  );
}
