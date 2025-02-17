"use server";
import { db } from "@/drizzle/drizzle-db";
import { kProjects, kTeams } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

export default handleServerErrors(async (employeeId: number) => {
  const employeeTeams = await db
    .select({ projectId: kTeams.projectId })
    .from(kTeams)
    .where(eq(kTeams.employeeId, employeeId));

  return db.query.kProjects.findMany({
    with: {
      kClient: true,
    },
    where: inArray(
      kProjects.id,
      employeeTeams.map((it) => it.projectId),
    ),
  });
});
