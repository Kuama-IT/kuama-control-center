"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { serverActionUtils } from "@/utils/server-actions.utils";
import { projectsServer } from "./projects.server";
import {
    type ProjectAddImagesInput,
    projectAddImagesSchema,
} from "./schemas/project.add-images.schema";

export const projectAddImagesAction = handleServerErrors(
    async (input: ProjectAddImagesInput) => {
        const parsedInput = projectAddImagesSchema.parse(input);

        await projectsServer.addImages(parsedInput);
    },
);

export const projectsUpsertFromYouTrackAction =
    serverActionUtils.createSafeAction(projectsServer.upsertAllFromYouTrack);
