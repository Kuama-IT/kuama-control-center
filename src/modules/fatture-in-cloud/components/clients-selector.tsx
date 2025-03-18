"use client";
import type { KClientListAllAction } from "@/modules/k-clients/actions/k-client-list-all-action";
import { Client } from "@fattureincloud/fattureincloud-ts-sdk/src/models/client";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import associateFattureInCloudClientAction from "@/modules/sync-data/actions/associate-fatture-in-cloud-client-action";
import { useRouter } from "next/navigation";
import { isFailure } from "@/utils/server-action-utils";
import { toast } from "sonner";

type Props = {
  kClients: KClientListAllAction;
  fattureInCloudClients: Array<Client>;
};
export const ClientsSelector = ({ kClients, fattureInCloudClients }: Props) => {
  const [kClientId, setKClientId] = useState<number | undefined>(undefined);
  const [fattureInCloudClient, setFattureInCloudClient] = useState<
    Client | undefined
  >(undefined);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="uppercase text-sm">K-Clients</h1>
        <ul className="flex flex-col gap-4">
          {kClients.map((client) => (
            <li
              className={cn("rounded-lg transition-all p-4 cursor-pointer", {
                "shadow-lg": kClientId !== client.id,
                shadow: kClientId === client.id,
              })}
              key={client.id}
              onClick={() => setKClientId(client.id)}
            >
              <p className="font-bold text-sm">{client.name}</p>
              {client.kVats.map(({ vat, id }) => (
                <p key={id} className="font-mono text-sm">
                  {vat}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="uppercase text-sm">Fatture in Cloud Clients</h1>
        <ul className="flex flex-col gap-4">
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
      <Button
        disabled={!fattureInCloudClient || !kClientId || isPending}
        size="lg"
        className="sticky top-4"
        onClick={() =>
          startTransition(async () => {
            if (!kClientId || !fattureInCloudClient) {
              return;
            }
            const res = await associateFattureInCloudClientAction({
              kClientId,
              fattureInCloudClient,
            });

            if (isFailure(res)) {
              toast("Error while associating clients", {
                className: "bg-error text-foreground",
              });
              return;
            }
            router.refresh();
          })
        }
      >
        Associate
      </Button>
    </div>
  );
};
