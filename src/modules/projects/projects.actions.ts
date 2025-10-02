"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { projectsServer } from "./projects.server";
import {
  projectAddImagesSchema,
  type ProjectAddImagesInput,
} from "./schemas/project.add-images.schema";

export const projectAddImagesAction = handleServerErrors(
  async (input: ProjectAddImagesInput) => {
    const parsedInput = projectAddImagesSchema.parse(input);

    await projectsServer.addImages(parsedInput);
  }
);
