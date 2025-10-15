"use client";

import { useMutation } from "@tanstack/react-query";
import {
    projectAddImagesAction,
    projectsUpsertFromYouTrackAction,
} from "../projects.actions";

export const useProjectAddImagesMutation = () =>
    useMutation({
        mutationFn: projectAddImagesAction,
    });

export const useProjectUpsertFromYouTrackMutation = () =>
    useMutation({
        mutationFn: projectsUpsertFromYouTrackAction,
    });
