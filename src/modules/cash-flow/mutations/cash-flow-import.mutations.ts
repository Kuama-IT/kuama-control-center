"use client";
import { cashFlowImportEntryFlagAsImportedAction } from "@/modules/cash-flow/cash-flow-import.actions";
import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";

export const useFlagCashFlowImportAsImportedMutation = () =>
    useServerActionMutation({
        action: cashFlowImportEntryFlagAsImportedAction,
    });
