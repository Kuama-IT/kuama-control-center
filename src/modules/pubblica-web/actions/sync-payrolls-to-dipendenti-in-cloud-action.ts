"use server";

import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import { serverEnv } from "@/env/server-env";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { handleServerErrors } from "@/utils/server-action-utils";

// TODO move
const handled = handleServerErrors(async function ({ date }: { date: Date }) {
  const pubblicaWebClient = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword
  );

  await pubblicaWebClient.authenticate();

  const payslips = await pubblicaWebClient.fetchPayslips(
    date.getFullYear(),
    date.getMonth() + 1
  );
  return await dipendentiInCloudApiClient.sendPayrolls({
    content: new Uint8Array(payslips.bytes),
    fileName: payslips.name,
  });
});

export default handled;
