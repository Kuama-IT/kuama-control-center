"use server";
import { cashFlowImportServer } from "@/modules/cash-flow/cash-flow-import.server";
import { serverActionUtils } from "@/utils/server-actions.utils";

export const cashFlowImportEntryFlagAsImportedAction =
    serverActionUtils.createSafeAction(cashFlowImportServer.flagAsImported, [
        "cash-flow/imports",
    ]);
