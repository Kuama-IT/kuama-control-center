"use client";

import { useEffect } from "react";
import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/failures.utils";
import { useImportClientsFromFattureInCloudMutation } from "../mutations/clients.mutations";

export function ImportClientsFromDicButton() {
    const mutation = useImportClientsFromFattureInCloudMutation();

    useEffect(() => {
        if (mutation.data) {
            if (!isFailure(mutation.data)) {
                notifySuccess(mutation.data.message);
                return;
            }

            notifyError(mutation.data.message);
        }
    }, [mutation.data]);
    return (
        <BrutalButton
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
        >
            {mutation.isPending ? "Importing" : "Run import"}
        </BrutalButton>
    );
}
