"use server";
import { getSalaryHistoryWithGrossAmounts } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-utils";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { handleServerErrors } from "@/utils/server-action-utils";

export default handleServerErrors(async (years: number[]) => {
  const history = await getSalaryHistoryWithGrossAmounts(
    dipendentiInCloudApiClient,
    years,
  );

  // TODO continue implementation
});
