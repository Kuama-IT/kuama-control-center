"use client";
import { startTransition } from "react";
import { syncData } from "@/modules/sync-data/sync-data";

export const SyncButton = () => {
  const onSyncDataClick = () =>
    startTransition(async () => {
      await syncData();
    });
  return <button onClick={onSyncDataClick}>Sync data</button>;
};
