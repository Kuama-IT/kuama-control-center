"use server";
import { db } from "@/drizzle/drizzle-db";
import { kProjects } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { handleServerErrors } from "@/utils/server-action-utils";

const handled = handleServerErrors(async () => {
  return await db.query.kPlatformCredentials.findMany({
    with: {
      kPlatformCredentialsToEmployeesAndProjects: true,
    },
  });
});

export default handled;
