"use client";

import {
    useReparsePubblicaWebPayslipsMutation,
    useStorePubblicaWebMissingMonthlyBalancesSince2021Mutation,
    useStorePubblicaWebMissingPayslipSourceFilesSince2021Mutation,
} from "@/modules/pubblica-web/mutations/pubblica-web.mutations";
import { BrutalButton } from "@/modules/ui";
import { isFailure } from "@/utils/failures.utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export function StoreAllPubblicaWebPayslipSourceFilesButton() {
    const mutation =
        useStorePubblicaWebMissingPayslipSourceFilesSince2021Mutation();

    return (
        <BrutalButton
            disabled={mutation.isPending}
            onClick={() =>
                mutation.mutate(undefined, {
                    onSuccess: (res) => {
                        if (isFailure(res)) {
                            notifyError(res.message);
                            return;
                        }

                        notifySuccess(
                            "All payslips source files correctly stored",
                        );
                    },
                })
            }
        >
            {mutation.isPending
                ? "Storing all payslips source files"
                : "Store all payslips source files"}
        </BrutalButton>
    );
}
