"use client";

import { useReparsePubblicaWebPayslipsMutation } from "@/modules/pubblica-web/mutations/pubblica-web.mutations";
import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/failures.utils";

export function ReparsePubblicaWebPayslipsButton() {
    const mutation = useReparsePubblicaWebPayslipsMutation();

    return (
        <BrutalButton
            onClick={() =>
                mutation.mutate(undefined, {
                    onSuccess: (res) => {
                        if (isFailure(res)) {
                            notifyError(res.message);
                            return;
                        }

                        notifySuccess("All payslips correctly re-parsed");
                    },
                })
            }
        >
            {mutation.isPending
                ? "re-importing all payslips from pubblica web"
                : "Re-import pubblica web payslips"}
        </BrutalButton>
    );
}
