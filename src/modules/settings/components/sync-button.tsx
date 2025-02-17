"use client";
import { useTransition } from "react";
import { syncData } from "@/modules/sync-data/sync-data";
import { Button } from "@/components/ui/button";
import { FaSync } from "react-icons/fa";
import { cn } from "@/lib/utils";

export const SyncButton = () => {
  const [isPending, startTransition] = useTransition();
  const onSyncDataClick = () =>
    startTransition(async () => {
      await syncData();
    });
  return (
    <Button disabled={isPending} size="lg" onClick={onSyncDataClick}>
      <FaSync className={cn({ "animate-spin": isPending })} />
      Sync data
    </Button>
  );
};
