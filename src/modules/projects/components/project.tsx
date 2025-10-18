import { Suspense } from "react";
import ClientSpentTime from "@/modules/clients/components/client-spent-time";
import { EmployeeAvatar } from "@/modules/employees/components/employee-avatar";
import { ProjectSlider } from "@/modules/projects/components/project-slider";
import { AddImageToProject } from "@/modules/projects/components/project-upload-images-button";
import { type ProjectReadExtended } from "@/modules/projects/schemas/projects.read.schema";

export const Project = ({ project }: { project: ProjectReadExtended }) => {
    return (
        <div>
            <div className="flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded bg-black text-white uppercase">
                        {project.name?.at(0)}
                    </span>
                    <h3 className="text-2xl">{project.name}</h3>
                </div>

                <div className="flex items-center divide-x">
                    <div className="px-4">
                        <Suspense
                            fallback={"loading project month spent time total"}
                        >
                            <ClientSpentTime
                                date={new Date()}
                                projectIds={[project.id]}
                            />
                        </Suspense>
                    </div>

                    <div className="px-4">
                        <p>{project.tasks.length} tasks</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 px-8 py-4">
                {project.teams.map((member) => (
                    <EmployeeAvatar
                        key={member.id}
                        avatarUrl={member.employee.avatarUrl}
                        fullName={member.employee.fullName}
                    />
                ))}
            </div>

            {project.projectMedias.length > 0 && (
                <ProjectSlider
                    projectName={project.name ?? ""}
                    images={project.projectMedias}
                />
            )}

            <div className="m-8">
                <AddImageToProject projectId={project.id} />
            </div>
        </div>
    );
};
