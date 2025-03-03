"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytSyncUsers from "@/modules/you-track/actions/yt-sync-users-action";
import { toast } from "sonner";
import { isFailure } from "@/utils/server-action-utils";

export const YtSyncUsersButton = () => {
  const [isPending, startTransition] = useTransition();

  const onSyncClick = () => {
    startTransition(async () => {
      const result = await ytSyncUsers();

      if (isFailure(result)) {
        toast("Error while importing users", {
          className: "bg-error text-foreground",
        });

        return;
      }

      toast(result.message, {
        className: "bg-success text-foreground",
      });
    });
  };

  return (
    <Button disabled={isPending} onClick={onSyncClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Sync users
    </Button>
  );
};
