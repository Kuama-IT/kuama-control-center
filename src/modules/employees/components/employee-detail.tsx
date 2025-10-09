import { employeesServer } from "@/modules/employees/employees.server";
import { BackButton } from "@/modules/ui/components/back-button";
import Image from "next/image";
import { projectsServer } from "@/modules/projects/projects.server";
import { ProjectCard } from "@/modules/projects/components/project-card";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { EmployeeDangerZone } from "@/modules/employees/components/employee-danger-zone";

export default async function EmployeeDetail({ id }: { id: number }) {
	const employee = await employeesServer.get(id);
	if (isFailure(employee)) {
		return <ErrorMessage failure={employee} />;
	}
	const employeeProjects = await projectsServer.getByEmployeeId(id);
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
				<h2 className="text-2xl animate-fade-in-from-left stagger-animation-700">{employee.fullName}</h2>
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
