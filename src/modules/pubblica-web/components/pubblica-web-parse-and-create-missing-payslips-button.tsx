"use client";

import {
    useParseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsMutation,
    useParseAllPubblicaWebUnparsedMonthlyBalancesMutation,
    useReparsePubblicaWebPayslipsMutation,
    useStorePubblicaWebMissingMonthlyBalancesSince2021Mutation,
} from "@/modules/pubblica-web/mutations/pubblica-web.mutations";
import { BrutalButton } from "@/modules/ui";
import { isFailure } from "@/utils/failures.utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export function ParseAndCreateMissingPubblicaWebPayslipsButton() {
    const mutation =
        useParseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsMutation();

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
                            "All payslips correctly parsed and created",
                        );
                    },
                })
            }
        >
            {mutation.isPending
                ? "Parsing and creating all missing payslips"
                : "Parse and create all missing payslips"}
        </BrutalButton>
    );
}
