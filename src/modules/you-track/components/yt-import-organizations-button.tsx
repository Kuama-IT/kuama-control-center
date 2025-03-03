"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ytImportOrganizations from "@/modules/you-track/actions/yt-import-organizations-action";
import { toast } from "sonner";
import { isFailure } from "@/utils/server-action-utils";

export const YtImportOrganizationsButton = () => {
  const [isPending, startTransition] = useTransition();

  const onImportOrganizationsClick = () => {
    startTransition(async () => {
      const result = await ytImportOrganizations();

      if (isFailure(result)) {
        toast("Error while importing organizations", {
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
    <Button disabled={isPending} onClick={onImportOrganizationsClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Import Organizations
    </Button>
  );
};
