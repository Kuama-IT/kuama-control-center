import { db } from "@/drizzle/drizzle-db";
import { teams } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { projectsDb } from "./projects.db";
import {
  projectAddImagesSchema,
  type ProjectAddImagesInput,
} from "./schemas/project.add-images.schema";

type ProjectsWithClient = Awaited<
  ReturnType<typeof projectsDb.findManyWithClientByIds>
>;

export const projectsServer = {
  async addImages(input: ProjectAddImagesInput): Promise<void> {
    const { projectId, images } = projectAddImagesSchema.parse(input);

    if (images.length === 0) {
      return;
    }

    const project = await projectsDb.findById(projectId);

    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const payload = images.map((url) => ({
      projectId: project.id,
      url,
    }));

    await projectsDb.insertProjectMedias(payload);
  },

  async getByEmployeeId(employeeId: number): Promise<ProjectsWithClient> {
    const employeeTeams = await db
      .select({ projectId: teams.projectId })
      .from(teams)
      .where(eq(teams.employeeId, employeeId));

    if (employeeTeams.length === 0) {
      return [];
    }

    const projectIds = Array.from(
      new Set(employeeTeams.map((team) => team.projectId))
    );

    return projectsDb.findManyWithClientByIds(projectIds);
  },
};
