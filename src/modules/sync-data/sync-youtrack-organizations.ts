import { db } from "@/drizzle/drizzle-db";
import { clients } from "@/drizzle/schema";
import { OrganizationListResponse } from "@/modules/you-track/schemas/youtrack-schemas";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";

export const syncYouTrackOrganizations = async (
  organizations: OrganizationListResponse,
) => {
  const projectsOrganizationMap = new Map<string, number>();
  await db.transaction(async (tx) => {
    for (const organization of organizations) {
      const payload: typeof clients.$inferInsert = {
        name: organization.name,
        youTrackRingId: organization.ringId,
        avatarUrl: prefixWithYouTrackAvatarBaseUrl(organization.iconUrl),
      };
      console.log(`syncYouTrackOrganizations -> ${payload.name}`);
      const res = await tx
        .insert(clients)
        .values(payload)
        .onConflictDoUpdate({
          target: clients.youTrackRingId,
          set: payload,
        })
        .returning({ clientId: clients.id });

      for (const project of organization.projects) {
        projectsOrganizationMap.set(project.ringId, res[0].clientId);
      }
    }
  });

  return projectsOrganizationMap;
};
