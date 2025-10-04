import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api-client";
import { clientsServer } from "@/modules/clients/clients.server";
import { ClientsSelector } from "./clients-selector";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function SyncClients() {
  const fattureInCloudClients = await fattureInCloudApiClient.getClients();
  const kClients = await clientsServer.listAll();
  if (isFailure(kClients)) {
    return <ErrorMessage failure={kClients} />;
  }
  // filter out already associated clients
  const notAssociatedFattureInCloudClients = fattureInCloudClients.filter(
    (fattureInCloudClient) => {
      return !kClients.some((kClient) => {
        return kClient.vats.some(({ vat }) => {
          return vat === fattureInCloudClient.vat_number;
        });
      });
    },
  );

  return (
    <ClientsSelector
      kClients={kClients}
      fattureInCloudClients={notAssociatedFattureInCloudClients}
    />
  );
}
