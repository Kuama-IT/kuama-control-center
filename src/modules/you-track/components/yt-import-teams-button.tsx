"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytImportTeams from "@/modules/you-track/actions/yt-import-teams-action";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const YtImportTeamsButton = () => {
  const [isPending, startTransition] = useTransition();

  const onSyncClick = () => {
    startTransition(async () => {
      const result = await ytImportTeams();

      if (isFailure(result)) {
        notifyError("Error while importing teams");

        return;
      }

      notifySuccess(result.message);
    });
  };

  return (
    <Button disabled={isPending} onClick={onSyncClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Import teams
    </Button>
  );
};
