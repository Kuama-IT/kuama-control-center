"use client";

import { BrutalButton } from "@/modules/ui";
import { useImportClientsFromFattureInCloudMutation } from "../mutations/clients.mutations";

export function ImportClientsFromDicButton() {
    const mutation = useImportClientsFromFattureInCloudMutation();

    return (
        <BrutalButton variant="secondary" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
             Run import
        </BrutalButton>
    )
}