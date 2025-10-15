import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { projects as projectsTable, teams } from "@/drizzle/schema";
import { organizationsDb } from "@/modules/clients/organizations.db";
import { type ProjectRead } from "@/modules/projects/schemas/projects.read.schema";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { type ServerActionResult } from "@/utils/server-actions.utils";
import { projectsDb } from "./projects.db";
import {
    type ProjectAddImagesInput,
    projectAddImagesSchema,
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
            new Set(employeeTeams.map((team) => team.projectId)),
        );

        return projectsDb.findManyWithClientByIds(projectIds);
    },
    async upsertAllFromYouTrack(): Promise<ServerActionResult> {
        const ytProjects = await youtrackApiClient.getProjects();
        const ytOrganizations = await youtrackApiClient.getOrganizations();

        return await db.transaction(async (tx) => {
            for (const ytProject of ytProjects) {
                const ytOrganization = ytOrganizations.find((it) =>
                    it.projects.map((p) => p.ringId === ytProject.ringId),
                );
                if (!ytOrganization) {
                    throw new Error(
                        `Could not find a YT organization for project ${ytProject.name}`,
                    );
                }
                // ensure we do have an organization for this project
                const organization =
                    await organizationsDb.tryGetByYoutrackRingId(
                        ytOrganization.ringId,
                    );

                if (!organization) {
                    throw new Error(
                        `Could not find organization for project ${ytProject.name}`,
                    );
                }

                const upsertValue = {
                    name: ytProject.name,
                    youTrackRingId: ytProject.ringId,
                    organizationId: organization.id,
                };
            }
        });
    },
};
