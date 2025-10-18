"use client";

import { BrutalButton } from "@/modules/ui";
import { type OrganizationRead } from "@/modules/you-track/schemas/organization-read";
import { useUnlinkOrganizationFromClientMutation } from "../mutations/clients-mappings.mutations";

export function UnlinkOrganizationFromClientButton({
    clientId,
    organization,
}: {
    clientId: number;
    organization: OrganizationRead;
}) {
    const mutation = useUnlinkOrganizationFromClientMutation(clientId);

    return (
        <BrutalButton
            variant="danger"
            onClick={() => mutation.mutate({ id: clientId })}
            disabled={mutation.isPending}
        >
            {mutation.isPending
                ? `Unlinking ${organization.name}`
                : `Unlink ${organization.name}`}
        </BrutalButton>
    );
}
