"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytImportTeams from "@/modules/you-track/actions/yt-import-teams-action";
import { toast } from "sonner";
import { isFailure } from "@/utils/server-action-utils";

export const YtImportTeamsButton = () => {
  const [isPending, startTransition] = useTransition();

  const onSyncClick = () => {
    startTransition(async () => {
      const result = await ytImportTeams();

      if (isFailure(result)) {
        toast("Error while importing teams", {
          className: "bg-error text-foreground",
        });

        return;
      }

      toast("K1 App", {
        description: result.message,
        className: "bg-success text-foreground",
      });
    });
  };

  return (
    <Button disabled={isPending} onClick={onSyncClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Import teams
    </Button>
  );
};
