"use client";

import { useParseAllPubblicaWebUnparsedMonthlyBalancesMutation } from "@/modules/pubblica-web/mutations/pubblica-web.mutations";
import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/failures.utils";

export function ParseAllPubblicaWebMonthlyBalancesButton() {
    const mutation = useParseAllPubblicaWebUnparsedMonthlyBalancesMutation();

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

                        notifySuccess("All monthly balances correctly parsed");
                    },
                })
            }
        >
            {mutation.isPending
                ? "Parsing all monthly balances"
                : "Parse all monthly balances"}
        </BrutalButton>
    );
}
