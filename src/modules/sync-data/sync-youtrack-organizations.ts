import { db } from "@/drizzle/drizzle-db";
import { clients, organizations as organizationsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { OrganizationListResponse } from "@/modules/you-track/schemas/youtrack-schemas";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";

export const syncYouTrackOrganizations = async (
    organizations: OrganizationListResponse,
) => {
    const projectsOrganizationMap = new Map<string, number>();
    await db.transaction(async (tx) => {
        for (const organization of organizations) {
            // Upsert client by name (as minimal record)
            const clientInsert: typeof clients.$inferInsert = {
                name: organization.name,
            };
            console.log(`syncYouTrackOrganizations -> ${clientInsert.name}`);
            const clientRes = await tx
                .insert(clients)
                .values(clientInsert)
                .onConflictDoNothing()
                .returning({ clientId: clients.id });

            // If client already existed, fetch its id
            const clientId = clientRes[0]?.clientId
                ? clientRes[0].clientId
                : (
                      await tx
                          .select({ id: clients.id })
                          .from(clients)
                          .where(eq(clients.name, organization.name))
                  )[0]?.id;

            if (!clientId) {
                throw new Error(
                    `Failed to resolve client id for organization ${organization.name}`,
                );
            }

            // Upsert organizations table linked to client
            const orgPayload: typeof organizationsTable.$inferInsert = {
                name: organization.name,
                youTrackRingId: organization.ringId,
                avatarUrl: prefixWithYouTrackAvatarBaseUrl(
                    organization.iconUrl,
                ),
                clientId,
            };
            await tx
                .insert(organizationsTable)
                .values(orgPayload)
                .onConflictDoUpdate({
                    target: organizationsTable.youTrackRingId,
                    set: orgPayload,
                });

            for (const project of organization.projects) {
                projectsOrganizationMap.set(project.ringId, clientId);
            }
        }
    });

    return projectsOrganizationMap;
};
