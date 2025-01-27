"use server";

import { db } from "@/drizzle/drizzle-db";
import { eq } from "drizzle-orm";
import { kProjectMedias, kProjects } from "@/drizzle/schema";

export const kProjectsAddImagesAction = async (
  projectId: number,
  images: string[],
) => {
  const project = await db.query.kProjects.findFirst({
    where: eq(kProjects.id, projectId),
  });

  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const payload = images.map((url) => ({
    projectId: project.id,
    url,
  }));

  await db.transaction(async (tx) => {
    await tx.insert(kProjectMedias).values(payload).onConflictDoNothing();
  });
};
