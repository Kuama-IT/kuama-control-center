"use client";

import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/server-action-utils";
import { useImportFromPubblicaWebPayslipsMutation } from "../mutations/payslips.mutations";

export function ImportPubblicaWebPayslipsButton() {
    const { mutateAsync, isPending } =
        useImportFromPubblicaWebPayslipsMutation();

    const onClick = async () => {
        const res = await mutateAsync();
        if (isFailure(res)) {
            notifyError(res.message ?? "Failed to import payslips");
            return;
        }
        notifySuccess("Payslips imported successfully");
    };

    return (
        <BrutalButton onClick={onClick} disabled={isPending}>
            {isPending ? "Syncing..." : "Sync Pubblica Web payslips"}
        </BrutalButton>
    );
}
