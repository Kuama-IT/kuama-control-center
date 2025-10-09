"use client";

import { BrutalButton } from "@/modules/ui";
import { useAutoLinkMutation } from "../mutations/clients-mappings.mutations";

export function AutolinkClientsAndOrganizationsButton() {
    const mutation = useAutoLinkMutation();

    return (
        <BrutalButton variant="secondary" onClick={() => mutation.mutate({ threshold: 0.8 })} disabled={mutation.isPending}>
              Auto-link suggestions ≥ 80%
        </BrutalButton>
    )
}