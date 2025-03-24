"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { db } from "@/drizzle/drizzle-db";
import { count, eq } from "drizzle-orm";
import { kEmployees, lower } from "@/drizzle/schema";
import { firstOrThrow } from "@/utils/array-utils";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";

const handled = handleServerErrors(async () => {
  const users = await youtrackApiClient.getUsers();

  const query = await db.select({ count: count() }).from(kEmployees);
  const result = firstOrThrow(query);

  await db.transaction(async (tx) => {
    for (const user of users) {
      if (!user.email) {
        continue;
      }

      if (user.email.toLowerCase().includes("daniele")) {
        continue;
      }
      const existingEmployee = await tx
        .select()
        .from(kEmployees)
        .where(eq(lower(kEmployees.email), user.email.toLowerCase()));

      if (existingEmployee.length === 0) {
        await tx.insert(kEmployees).values({
          fullName: user.fullName,
          email: user.email,
          avatarUrl: prefixWithYouTrackAvatarBaseUrl(user.avatarUrl),
        });
        continue;
      }
      await tx
        .update(kEmployees)
        .set({
          avatarUrl: prefixWithYouTrackAvatarBaseUrl(user.avatarUrl),
        })
        .where(eq(lower(kEmployees.email), user.email.toLowerCase()));
    }
  });
  return {
    message: `Now you have ${result.count} employees`,
  };
});

export default handled;
