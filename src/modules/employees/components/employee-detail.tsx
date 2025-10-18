import Image from "next/image";
import { EmployeeDangerZone } from "@/modules/employees/components/employee-danger-zone";
import { EmployeeDetailPayslips } from "@/modules/employees/components/employee-detail-payslips";
import { EmployeeQuotas } from "@/modules/employees/components/employee-quotas";
import { employeesServer } from "@/modules/employees/employees.server";
import { ProjectCard } from "@/modules/projects/components/project-card";
import { projectsServer } from "@/modules/projects/projects.server";
import { BrutalCard } from "@/modules/ui";
import { BackButton } from "@/modules/ui/components/back-button";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";

export default async function EmployeeDetail({ id }: { id: number }) {
    const employee = await employeesServer.getExtended(id);
    if (isFailure(employee)) {
        return <ErrorMessage failure={employee} />;
    }
    const employeeProjects = await projectsServer.getByEmployeeId(id);
    return (
        <div className="flex flex-col">
            <div className="relative top-0 z-10 flex items-center gap-4 p-8">
                <BackButton />
                {employee.avatarUrl && employee.fullName && (
                    <Image
                        src={employee.avatarUrl}
                        alt={employee.fullName}
                        width={100}
                        height={100}
                        className="animate-fade-in-from-left rounded-full"
                    />
                )}
                <h2 className="stagger-animation-700 animate-fade-in-from-left text-2xl">
                    {employee.fullName}
                </h2>
            </div>

            <div className="flex flex-col gap-8">
                <BrutalCard className="mx-8">
                    <EmployeeQuotas employee={employee} />
                </BrutalCard>

                <BrutalCard className="mx-8">
                    <EmployeeDetailPayslips payslips={employee.payslips} />
                </BrutalCard>
            </div>

            <div className="grid grid-cols-4 gap-8 px-8">
                {employeeProjects.map((it, index) => (
                    <ProjectCard key={it.id} project={it} index={index} />
                ))}
            </div>

            <div className="p-8">
                <EmployeeDangerZone employee={employee} />
            </div>
        </div>
    );
}
