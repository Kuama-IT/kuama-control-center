import { Suspense } from "react";
import KClientSpentTime from "@/modules/k-clients/components/k-client-spent-time";
import { AddImageToProject } from "@/modules/projects/components/project-upload-images-button";
import { ProjectSlider } from "@/modules/projects/components/project-slider";
import { KEmployeeAvatar } from "@/modules/k-employees/components/k-employee-avatar";
import { ProjectReadExtended } from "@/modules/projects/schemas/projects.read.schema";

export const Project = ({ project }: { project: ProjectReadExtended }) => {
  return (
    <div>
      <div className="flex justify-between items-center px-8">
        <div className="flex gap-4 items-center">
          <span className="flex items-center justify-center h-10 w-10 rounded bg-black text-white uppercase">
            {project.name?.at(0)}
          </span>
          <h3 className="text-2xl">{project.name}</h3>
        </div>

        <div className="flex divide-x items-center">
          <div className="px-4">
            <Suspense fallback={"loading project month spent time total"}>
              <KClientSpentTime date={new Date()} projectIds={[project.id]} />
            </Suspense>
          </div>

          <div className="px-4">
            <p>{project.tasks.length} tasks</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 py-4 px-8">
        {project.teams.map((member) => (
          <KEmployeeAvatar key={member.id} employee={member.employee} />
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
