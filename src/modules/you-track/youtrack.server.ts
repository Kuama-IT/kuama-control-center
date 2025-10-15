import { count } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { organizations } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";
import { youtrackApiClient } from "./youtrack-api-client";
import { prefixWithYouTrackAvatarBaseUrl } from "./youtrack-utils";

export const youTrackServer = {
    async importAllOrganizations(): Promise<{ message: string }> {
        const ytOrganizations = await youtrackApiClient.getOrganizations();
        const payload: (typeof organizations.$inferInsert)[] = ytOrganizations
            .filter((it) => !it.name.toLowerCase().includes("kuama"))
            .map((organization) => ({
                name: organization.name,
                youTrackRingId: organization.ringId,
                avatarUrl: prefixWithYouTrackAvatarBaseUrl(
                    organization.iconUrl,
                ),
                clientId: undefined,
            }));

        await db.transaction(async (tx) => {
            await tx.delete(organizations);
            await tx.insert(organizations).values(payload);
        });

        const query = await db.select({ count: count() }).from(organizations);
        const result = firstOrThrow(query);

        return { message: `Now you have ${result.count} organizations` };
    },

    async importAllProjects(): Promise<{ message: string }> {
        const ytProjects = await youtrackApiClient.getProjects();

        return { message: `Now you have ${0} projects` };
    },
};
