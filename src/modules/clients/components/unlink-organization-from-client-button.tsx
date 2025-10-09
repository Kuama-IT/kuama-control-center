"use client";

import { BrutalButton } from "@/modules/ui";
import { useUnlinkOrganizationFromClientMutation } from "../mutations/clients-mappings.mutations";

export function UnlinkOrganizationFromClientButton({organizationId}: { organizationId: number}) {
    const mutation = useUnlinkOrganizationFromClientMutation();

    return (
        <BrutalButton variant="danger" onClick={() => mutation.mutate({  organizationId })} disabled={mutation.isPending}>
               Unlink
        </BrutalButton>
    )
}