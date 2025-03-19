"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytImportProjects from "@/modules/you-track/actions/yt-import-projects-action";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const YtImportProjectsButton = () => {
  const [isPending, startTransition] = useTransition();

  const onImportProjectsClick = () => {
    startTransition(async () => {
      const result = await ytImportProjects();

      if (isFailure(result)) {
        notifyError(result.message);

        return;
      }

      notifySuccess(result.message);
    });
  };

  return (
    <Button disabled={isPending} onClick={onImportProjectsClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Import projects
    </Button>
  );
};
