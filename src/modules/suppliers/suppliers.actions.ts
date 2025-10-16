"use server";
import { suppliersServer } from "@/modules/suppliers/suppliers.server";
import { serverActionUtils } from "@/utils/server-actions.utils";

export const upsertAllSuppliersFromFattureInCloudAction =
    serverActionUtils.createSafeAction(
        suppliersServer.upsertAllFromFattureInCloud,
    );
