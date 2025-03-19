"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytSyncUsers from "@/modules/you-track/actions/yt-sync-users-action";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const YtSyncUsersButton = () => {
  const [isPending, startTransition] = useTransition();

  const onSyncClick = () => {
    startTransition(async () => {
      const result = await ytSyncUsers();

      if (isFailure(result)) {
        notifyError("Error while importing users");

        return;
      }

      notifySuccess(result.message);
    });
  };

  return (
    <Button disabled={isPending} onClick={onSyncClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Sync users
    </Button>
  );
};
