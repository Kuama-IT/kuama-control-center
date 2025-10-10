import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api";
import { clientsServer } from "@/modules/clients/clients.server";
import { ClientsSelector } from "./clients-selector";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { BrutalCard, BrutalButton, brutalTheme } from "@/modules/ui";
import { importFromFattureInCloudAction } from "@/modules/clients/clients.actions";

export default async function SyncClients() {
  async function onImportClients() {
    "use server";
    await importFromFattureInCloudAction();
  }

  const fattureInCloudClients = await fattureInCloudApiClient.getClients();
  const clients = await clientsServer.listAll();
  if (isFailure(clients)) {
    return <ErrorMessage failure={clients} />;
  }
  // filter out already associated clients
  const notAssociatedFattureInCloudClients = fattureInCloudClients.filter(
    (fattureInCloudClient) => {
      return !clients.some((client) => {
        return client.vats.some(({ vat }) => {
          return vat === fattureInCloudClient.vat_number;
        });
      });
    },
  );

  return (
    <BrutalCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={brutalTheme.typography.heading}>Sync clients</h2>
        <form action={onImportClients}>
          <BrutalButton type="submit" variant="secondary">
            Import clients from Fatture in Cloud
          </BrutalButton>
        </form>
      </div>
      <ClientsSelector
        clients={clients}
        fattureInCloudClients={notAssociatedFattureInCloudClients}
      />
    </BrutalCard>
  );
}
