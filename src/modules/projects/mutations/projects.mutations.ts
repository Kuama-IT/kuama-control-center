"use client";

import { useMutation } from "@tanstack/react-query";
import { projectAddImagesAction } from "../projects.actions";

export const useProjectAddImagesMutation = () =>
  useMutation({
    mutationFn: projectAddImagesAction,
  });
