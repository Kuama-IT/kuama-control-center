import { kProjectsServer } from "@/modules/k-projects/k-projects-server";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { BackButton } from "@/modules/ui/components/back-button";
import Image from "next/image";
import { KProjectCard } from "@/modules/k-projects/components/k-project-card";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { KEmployeeDangerZone } from "@/modules/k-employees/components/k-employee-danger-zone";

export default async function KEmployeeDetail({ id }: { id: number }) {
  const employee = await kEmployeesServer.byId(id);
  if (isFailure(employee)) {
    return <ErrorMessage failure={employee} />;
  }
  const employeeProjects = await kProjectsServer.byEmployeeId(id);
  if (isFailure(employeeProjects)) {
    return <ErrorMessage failure={employeeProjects} />;
  }
  return (
    <div className="flex flex-col">
      <div className="flex gap-4 items-center p-8 top-0 relative z-10">
        <BackButton />
        {employee.avatarUrl && employee.fullName && (
          <Image
            src={employee.avatarUrl}
            alt={employee.fullName}
            width={100}
            height={100}
            className="rounded-full animate-fade-in-from-left"
          />
        )}
        <h2 className="text-2xl animate-fade-in-from-left stagger-animation-700">
          {employee.fullName}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-8 px-8">
        {employeeProjects.map((it, index) => (
          <KProjectCard key={it.id} project={it} index={index} />
        ))}
      </div>

      <div className="p-8">
        <KEmployeeDangerZone employee={employee} />
      </div>
    </div>
  );
}
