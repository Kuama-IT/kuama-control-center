"use server";
import { db } from "@/drizzle/drizzle-db";
import { handleServerErrors } from "@/utils/server-action-utils";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { kClients, kPlatformCredentials } from "@/drizzle/schema";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";
import { count } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";

export default handleServerErrors(async () => {
  const organizations = await youtrackApiClient.getOrganizations();
  const payload: (typeof kClients.$inferInsert)[] = organizations
    .filter((it) => !it.name.toLowerCase().includes("kuama"))
    .map((organization) => ({
      name: organization.name,
      youTrackRingId: organization.ringId,
      avatarUrl: prefixWithYouTrackAvatarBaseUrl(organization.iconUrl),
    }));

  await db.transaction(async (tx) => {
    await tx.delete(kClients);
    await tx.insert(kClients).values(payload);
  });

  const query = await db.select({ count: count() }).from(kClients);
  const result = firstOrThrow(query);

  return { message: `Now you have ${result.count} clients` };
});
