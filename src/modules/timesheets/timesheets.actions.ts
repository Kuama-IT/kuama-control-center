"use server";
import { serverActionUtils } from "@/utils/server-actions.utils";
import { timesheetsServer } from "@/modules/timesheets/timesheets.server";

export const syncAbsenceReasonsAndClosuresFromDipendentiInCloudAction =
  serverActionUtils.createSafeAction(
    timesheetsServer.syncAbsenceReasonsAndClosuresFromDipendentiInCloud,
  );

export const syncPresenceAndAbsenceFromDipendentiInCloudAction =
  serverActionUtils.createSafeAction(
    timesheetsServer.syncPresenceAndAbsenceFromDipendentiInCloud,
  );
