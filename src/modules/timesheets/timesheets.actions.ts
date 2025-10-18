"use server";
import { timesheetsServer } from "@/modules/timesheets/timesheets.server";
import { serverActionUtils } from "@/utils/server-actions.utils";

export const syncAbsenceReasonsAndClosuresFromDipendentiInCloudAction =
    serverActionUtils.createSafeAction(
        timesheetsServer.syncAbsenceReasonsAndClosuresFromDipendentiInCloud,
    );

export const syncPresenceAndAbsenceFromDipendentiInCloudAction =
    serverActionUtils.createSafeAction(
        timesheetsServer.syncPresenceAndAbsenceFromDipendentiInCloud,
    );
