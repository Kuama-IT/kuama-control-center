import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { ClientsSelector } from "./clients-selector";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function SyncClients() {
  const fattureInCloudClients = await fattureInCloudApiClient.getClients();
  const kClients = await kClientsServer.listAll();
  if (isFailure(kClients)) {
    return <ErrorMessage failure={kClients} />;
  }
  // remove already associated clients
  const filtered = fattureInCloudClients.filter((fattureInCloudClient) => {
    return !kClients.some((kClient) => {
      return kClient.kVats.some((kVat) => {
        return kVat.vat === fattureInCloudClient.vat_number;
      });
    });
  });

  return (
    <ClientsSelector kClients={kClients} fattureInCloudClients={filtered} />
  );
}
