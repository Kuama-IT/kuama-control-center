"use client";

import { BrutalButton } from "@/modules/ui";
import { useLinkOrganizationToClientMutation } from "../mutations/clients-mappings.mutations";

export function LinkOrganizationToClientButton({clientName, score, clientId, organizationId}: {clientName: string, score: number, clientId: number, organizationId: number}) {
    const mutation = useLinkOrganizationToClientMutation();

    return (
        <BrutalButton variant="secondary" onClick={() => mutation.mutate({ clientId, organizationId })} disabled={mutation.isPending}>
               {clientName} · {(score * 100).toFixed(0)}%
        </BrutalButton>
    )
}