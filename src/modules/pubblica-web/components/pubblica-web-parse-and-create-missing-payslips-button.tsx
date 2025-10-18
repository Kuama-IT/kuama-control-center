"use client";

import { useParseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsMutation } from "@/modules/pubblica-web/mutations/pubblica-web.mutations";
import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/failures.utils";

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
