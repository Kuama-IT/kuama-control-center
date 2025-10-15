"use client";

import { useState } from "react";
import {
    BrutalButton,
    BrutalFormField,
    BrutalSelect,
    BrutalSelectItem,
} from "@/modules/ui";
import { useLinkOrganizationToClientMutation } from "../mutations/clients-mappings.mutations";
import { OrganizationRead } from "@/modules/you-track/schemas/organization-read";

export function ManualLinkOrganizationToClient({
    clientId,
    organizations,
}: {
    clientId: number;
    organizations: OrganizationRead[];
}) {
    const [value, setValue] = useState<string | undefined>(undefined);
    const mutation = useLinkOrganizationToClientMutation(clientId);

    const selectedOrganizationId = value ? parseInt(value, 10) : undefined;

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <BrutalFormField label="Manual match">
                <BrutalSelect
                    value={value}
                    onValueChange={setValue}
                    placeholder="Select client..."
                >
                    {organizations.map((o) => (
                        <BrutalSelectItem key={o.id} value={String(o.id)}>
                            {o.name ?? `Organization #${o.id}`}
                        </BrutalSelectItem>
                    ))}
                </BrutalSelect>
            </BrutalFormField>
            <BrutalButton
                onClick={() =>
                    selectedOrganizationId &&
                    mutation.mutate({
                        organizationId: selectedOrganizationId,
                        clientId,
                    })
                }
                disabled={!selectedOrganizationId || mutation.isPending}
            >
                Link
            </BrutalButton>
        </div>
    );
}
