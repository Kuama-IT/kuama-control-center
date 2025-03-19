"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytImportOrganizations from "@/modules/you-track/actions/yt-import-organizations-action";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const YtImportOrganizationsButton = () => {
  const [isPending, startTransition] = useTransition();

  const onImportOrganizationsClick = () => {
    startTransition(async () => {
      const result = await ytImportOrganizations();

      if (isFailure(result)) {
        notifyError("Error while importing organizations");

        return;
      }

      notifySuccess(result.message);
    });
  };

  return (
    <Button disabled={isPending} onClick={onImportOrganizationsClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Import Organizations
    </Button>
  );
};
