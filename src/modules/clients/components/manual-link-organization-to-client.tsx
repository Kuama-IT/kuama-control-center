"use client";

import { useState } from "react";
import {
  BrutalButton,
  BrutalFormField,
  BrutalSelect,
  BrutalSelectItem,
} from "@/modules/ui";
import { useLinkOrganizationToClientMutation } from "../mutations/clients-mappings.mutations";

type ClientOption = { id: number; name: string | null };

export function ManualLinkOrganizationToClient({
  organizationId,
  clients,
}: {
  organizationId: number;
  clients: ClientOption[];
}) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const mutation = useLinkOrganizationToClientMutation();

  const selectedClientId = value ? parseInt(value, 10) : undefined;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <BrutalFormField label="Manual match">
        <BrutalSelect
          value={value}
          onValueChange={setValue}
          placeholder="Select client..."
        >
          {clients.map((c) => (
            <BrutalSelectItem key={c.id} value={String(c.id)}>
              {c.name ?? `Client #${c.id}`}
            </BrutalSelectItem>
          ))}
        </BrutalSelect>
      </BrutalFormField>
      <BrutalButton
        onClick={() =>
          selectedClientId &&
          mutation.mutate({ organizationId, clientId: selectedClientId })
        }
        disabled={!selectedClientId || mutation.isPending}
      >
        Link
      </BrutalButton>
    </div>
  );
}
