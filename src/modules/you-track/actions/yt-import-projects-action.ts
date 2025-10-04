"use server";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { clients, organizations as organizationsTable, projects as projectsTable } from "@/drizzle/schema";
import { count } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";

const handled = handleServerErrors(async () => {
  const clientsResult = await db.select().from(clients);
  const orgsResult = await db.select().from(organizationsTable);

  const projects = await youtrackApiClient.getProjects();
  const organizations = await youtrackApiClient.getOrganizations();

  const projectsPayload: (typeof projectsTable.$inferInsert)[] = [];

  for (const project of projects) {
    const organization = organizations.find((it) =>
      it.projects.find((p) => p.ringId === project.ringId)
    );
    if (!organization) {
      throw new Error(
        `Organization not found for project ${project.name}. Try importing organizations first.`
      );
    }

  const clientIdForOrg = orgsResult.find((it) => (it as any).youTrackRingId === organization.ringId)?.clientId as number | undefined;
    const client = clientsResult.find((it) => it.id === clientIdForOrg);
    if (!client && organization.name.toLowerCase().includes("kuama")) {
      continue;
    }

    if (!client) {
      throw new Error(
        `Client ${organization.name} not found for project ${project.name}. Try importing organizations first.`
      );
    }

    projectsPayload.push({
      name: project.name,
      youTrackRingId: project.ringId,
      clientId: client.id,
    });
  }

  await db.transaction(async (tx) => {
    await tx.delete(projectsTable);
    await tx.insert(projectsTable).values(projectsPayload);
  });

  const query = await db.select({ count: count() }).from(projectsTable);
  const result = firstOrThrow(query);

  return { message: `Now you have ${result.count} projects` };
});

export default handled;
