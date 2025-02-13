import { Title } from "@/modules/ui/components/title";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { KEmployeeCard } from "@/modules/k-employees/components/k-employee-card";

export default async function KEmployees() {
  const employees = await kEmployeesServer.listAll();
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
