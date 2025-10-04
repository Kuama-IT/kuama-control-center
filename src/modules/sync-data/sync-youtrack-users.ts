import { employees } from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { ReducedUser } from "@/modules/you-track/schemas/youtrack-schemas";
import { prefixWithYouTrackAvatarBaseUrl } from "@/modules/you-track/youtrack-utils";

export const syncYoutrackUsers = async () => {
  console.time("sync YT employee");

  const youTrackUsers = await youtrackApiClient.getUsers();
  const users: Array<ReducedUser & { employeeId: number }> = [];
  // TODO we should discern if user is employee or not
  await db.transaction(async (tx) => {
    for (const user of youTrackUsers) {
      console.log(`syncYouTrackUser -> ${user.email}`);
      const employeePayload: typeof employees.$inferInsert = {
        fullName: user.fullName,
        email: user.email,
        avatarUrl: prefixWithYouTrackAvatarBaseUrl(user.avatarUrl),
      };
      // ensure we do have the user as employee in our database
      const res = await db
        .insert(employees)
        .values(employeePayload)
        .onConflictDoUpdate({
          target: employees.email,
          set: employeePayload,
        })
        .returning({ employeeId: employees.id });
      if (res.length != 1) {
        throw new Error(
          `Inconsistent number of employees for YT user ${user.email}: ${res.length}`,
        );
      }
      users.push({ ...user, employeeId: res[0].employeeId });
    }
  });

  console.timeEnd("sync YT employee");
  return users;
};
