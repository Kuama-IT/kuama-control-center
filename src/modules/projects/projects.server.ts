import { eq } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { projects, teams } from "@/drizzle/schema";
import { organizationsDb } from "@/modules/clients/organizations.db";
import { employeesDb } from "@/modules/employees/employees.db";
import { type ProjectRead } from "@/modules/projects/schemas/projects.read.schema";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { type ServerActionResult } from "@/utils/server-actions.utils";
import { projectsDb } from "./projects.db";
import {
    type ProjectAddImagesInput,
    projectAddImagesSchema,
} from "./schemas/project.add-images.schema";

export const projectsServer = {
    async addImages(input: ProjectAddImagesInput): Promise<void> {
        const { projectId, images } = projectAddImagesSchema.parse(input);

        if (images.length === 0) {
            return;
        }

        const project = await projectsDb.getById(projectId);

        if (!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        const payload = images.map((url) => ({
            projectId: project.id,
            url,
        }));

        await projectsDb.insertProjectMedias(payload);
    },

    async getByEmployeeId(employeeId: number): Promise<ProjectRead[]> {
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

        return projectsDb.getByIds(projectIds);
    },
    async upsertAllFromYouTrack(): Promise<ServerActionResult> {
        const ytProjects = await youtrackApiClient.getProjects();
        const ytOrganizations = await youtrackApiClient.getOrganizations();

        await db.transaction(async (tx) => {
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

                await tx
                    .insert(projects)
                    .values(upsertValue)
                    .onConflictDoUpdate({
                        target: projects.youTrackRingId,
                        set: {
                            name: ytProject.name,
                            organizationId: organization.id,
                        },
                    });
            }
        });

        const projectRecords = await db.select().from(projects);

        // for each project, upsert the team with current employees
        for (const projectRecord of projectRecords) {
            const ytProject = ytProjects.find(
                (it) => it.ringId === projectRecord.youTrackRingId,
            );

            const ytTeam = ytProject?.team?.users;
            if (ytTeam === undefined) {
                // biome-ignore lint/suspicious/noConsole: I want to see what gets skipped
                console.log(
                    `Skipping team creation for ${projectRecord.name} since there is no YT team`,
                );
                continue;
            }

            // drop current team for project
            await db.transaction(async (tx) => {
                await tx
                    .delete(teams)
                    .where(eq(teams.projectId, projectRecord.id));

                for (const ytTeamMember of ytTeam) {
                    // find employee by youTrackId
                    const employee = await employeesDb.tryGetByEmail(
                        ytTeamMember.profile?.email?.email ?? "",
                    );
                    if (!employee) {
                        console.error(
                            `Could not find employee in ${projectRecord.name} team with email ${ytTeamMember.profile?.email?.email}`,
                        );
                        throw new Error();
                    }

                    await tx
                        .insert(teams)
                        .values({
                            employeeId: employee.id,
                            projectId: projectRecord.id,
                        })
                        .onConflictDoNothing();
                }
            });
        }

        return {
            message: `Now you have ${projectRecords?.length ?? 0} projects`,
        };
    },
};
