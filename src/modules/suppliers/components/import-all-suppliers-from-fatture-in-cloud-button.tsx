"use client";
import { useUpsertAllSuppliersFromFattureInCloudMutation } from "@/modules/suppliers/mutations/suppliers.mutations";
import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export function ImportAllSuppliersFromFattureInCloudButton() {
    const mutation = useUpsertAllSuppliersFromFattureInCloudMutation();

    const onClick = () => {
        mutation.mutate(undefined, {
            onSuccess: (data) => {
                if (data) {
                    notifySuccess(data?.message);
                }
            },
            onError: (data) => {
                notifyError(data.message);
            },
        });
    };
    return (
        <BrutalButton onClick={onClick} disabled={mutation.isPending}>
            {mutation.isPending ? "Importing" : "Run import"}
        </BrutalButton>
    );
}
