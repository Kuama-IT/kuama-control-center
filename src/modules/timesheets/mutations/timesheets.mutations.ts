"use client";
import {
  syncAbsenceReasonsAndClosuresFromDipendentiInCloudAction,
  syncPresenceAndAbsenceFromDipendentiInCloudAction,
} from "@/modules/timesheets/timesheets.actions";
import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";

export const useSyncAbsenceReasonsAndClosuresFromDipendentiInCloudMutation =
  () => {
    return useServerActionMutation({
      action: syncAbsenceReasonsAndClosuresFromDipendentiInCloudAction,
    });
  };
export const useSyncPresenceAndAbsenceFromDipendentiInCloudActionMutation =
  () => {
    return useServerActionMutation({
      action: syncPresenceAndAbsenceFromDipendentiInCloudAction,
    });
  };
