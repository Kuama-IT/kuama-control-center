"use server";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { kClients, kPlatformCredentials, kProjects } from "@/drizzle/schema";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";
import { count } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";

export default handleServerErrors(async () => {
  const clients = await db.select().from(kClients);

  const projects = await youtrackApiClient.getProjects();
  const organizations = await youtrackApiClient.getOrganizations();

  const projectsPayload: (typeof kProjects.$inferInsert)[] = [];

  for (const project of projects) {
    const organization = organizations.find((it) =>
      it.projects.find((p) => p.ringId === project.ringId),
    );
    if (!organization) {
      throw new Error(
        `Organization not found for project ${project.name}. Try importing organizations first.`,
      );
    }

    const client = clients.find(
      (it) => it.youTrackRingId === organization.ringId,
    );
    if (!client && organization.name.toLowerCase().includes("kuama")) {
      continue;
    }

    if (!client) {
      throw new Error(
        `Client ${organization.name} not found for project ${project.name}. Try importing organizations first.`,
      );
    }

    projectsPayload.push({
      name: project.name,
      youTrackRingId: project.ringId,
      clientId: client.id,
    });
  }

  await db.transaction(async (tx) => {
    await tx.delete(kProjects);
    await tx.insert(kProjects).values(projectsPayload);
  });

  const query = await db.select({ count: count() }).from(kProjects);
  const result = firstOrThrow(query);

  return { message: `Now you have ${result.count} projects` };
});
