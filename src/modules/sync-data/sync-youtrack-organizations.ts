import { db } from "@/drizzle/drizzle-db";
import { kClients } from "@/drizzle/schema";
import { OrganizationListResponse } from "@/modules/you-track/schemas/youtrack-schemas";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";

export const syncYouTrackOrganizations = async (
  organizations: OrganizationListResponse,
) => {
  const projectsOrganizationMap = new Map<string, number>();
  await db.transaction(async (tx) => {
    for (const organization of organizations) {
      const payload: typeof kClients.$inferInsert = {
        name: organization.name,
        youTrackRingId: organization.ringId,
        avatarUrl: prefixWithYouTrackAvatarBaseUrl(organization.iconUrl),
      };
      console.log(`syncYouTrackOrganizations -> ${payload.name}`);
      const res = await tx
        .insert(kClients)
        .values(payload)
        .onConflictDoUpdate({
          target: kClients.youTrackRingId,
          set: payload,
        })
        .returning({ clientId: kClients.id });

      for (const project of organization.projects) {
        projectsOrganizationMap.set(project.ringId, res[0].clientId);
      }
    }
  });

  return projectsOrganizationMap;
};
