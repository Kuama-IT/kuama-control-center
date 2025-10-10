"use client";
import type { ClientListItem } from "@/modules/clients/clients.server";
import { Client } from "@fattureincloud/fattureincloud-ts-sdk/src/models/client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import associateFattureInCloudClientAction from "@/modules/sync-data/actions/associate-fatture-in-cloud-client-action";
import { useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";

type Props = {
  clients: ClientListItem[];
  fattureInCloudClients: Array<Client>;
};
export const ClientsSelector = ({ clients, fattureInCloudClients }: Props) => {
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(
    undefined,
  );
  const [fattureInCloudClient, setFattureInCloudClient] = useState<
    Client | undefined
  >(undefined);
  const router = useRouter();
  const { mutateAsync, isPending } = useServerActionMutation({
    action: associateFattureInCloudClientAction,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="uppercase text-sm">Clients</h1>
        <div className="overflow-x-auto px-2 py-4 max-w-xl">
          <ul className="flex gap-4">
            {clients.map((client) => (
              <li
                className={cn("rounded-lg transition-all p-4 cursor-pointer", {
                  "shadow-lg": selectedClientId !== client.id,
                  shadow: selectedClientId === client.id,
                })}
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
              >
                <p className="font-bold text-sm">{client.name}</p>
                {client.vats.map(({ vat, id }) => (
                  <p key={id} className="font-mono text-sm">
                    {vat}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="uppercase text-sm">Fatture in Cloud Clients</h1>
        <div className="overflow-x-auto px-2 py-4 max-w-xl">
          <ul className="flex gap-4">
            {fattureInCloudClients.map((client) => (
              <li
                className={cn("rounded-lg transition-all p-4 cursor-pointer", {
                  "shadow-lg": fattureInCloudClient?.id !== client.id,
                  shadow: fattureInCloudClient?.id === client.id,
                })}
                key={client.id}
                onClick={() => client.id && setFattureInCloudClient(client)}
              >
                <p className="font-bold text-sm">{client.name}</p>
                <p className="font-mono text-sm">{client.vat_number}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <Button
          disabled={!fattureInCloudClient || !selectedClientId || isPending}
          size="lg"
          className="sticky top-4"
          onClick={async () => {
            if (!selectedClientId || !fattureInCloudClient) return;
            try {
              await mutateAsync({
                kClientId: selectedClientId,
                fattureInCloudClient,
              });
              const selectedClient = clients.find(
                (client) => client.id === selectedClientId,
              );
              notifySuccess(
                `Correctly associated ${fattureInCloudClient.vat_number} to ${selectedClient?.name}`,
              );
              router.refresh();
            } catch (e) {
              notifyError("Error while associating clients");
            }
          }}
        >
          Associate
        </Button>
      </div>
    </div>
  );
};
