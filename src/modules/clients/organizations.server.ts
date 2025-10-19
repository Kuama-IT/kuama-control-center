import { count } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { organizations } from "@/drizzle/schema";
import { organizationsDb } from "@/modules/clients/organizations.db";
import { type OrganizationRead } from "@/modules/you-track/schemas/organization-read";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";
import { firstOrThrow } from "@/utils/array-utils";

export const organizationsServer = {
    async upsertAllFromYouTrack(): Promise<{ message: string }> {
        const ytOrganizations = await youtrackApiClient.getOrganizations();

        const records: (typeof organizations.$inferInsert)[] = ytOrganizations
            .filter((it) => !it.name.toLowerCase().includes("kuama"))
            .map((organization) => ({
                name: organization.name,
                youTrackRingId: organization.ringId,
                avatarUrl: prefixWithYouTrackAvatarBaseUrl(
                    organization.iconUrl,
                ),
            }));

        return await db.transaction(async (tx) => {
            for (const record of records) {
                await tx
                    .insert(organizations)
                    .values(record)
                    .onConflictDoUpdate({
                        target: organizations.youTrackRingId,
                        set: {
                            name: record.name,
                            avatarUrl: record.avatarUrl,
                        },
                    });
            }

            const query = await db
                .select({ count: count() })
                .from(organizations);

            const result = firstOrThrow(query);

            return { message: `Now you have ${result.count} organizations` };
        });
    },
    getById(id: number): Promise<OrganizationRead> {
        return organizationsDb.getById(id);
    },
};
