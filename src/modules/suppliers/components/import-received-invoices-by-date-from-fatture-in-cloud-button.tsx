"use client";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { useImportReceivedInvoicesByDateFromFattureInCloudMutation } from "@/modules/invoices/mutations/invoices.mutations";
import { BrutalButton } from "@/modules/ui";
import { BrutalCalendarRange } from "@/modules/ui/components/brutal-advanced";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

type _DateRange = {
    from: Date;
    to: Date;
};

export function ImportReceivedInvoicesByDateFromFattureInCloudButton() {
    const mutation =
        useImportReceivedInvoicesByDateFromFattureInCloudMutation();

    const [range, setRange] = useState<_DateRange | undefined>(undefined);

    const onSelectRange = (dateRange: DateRange | undefined) => {
        const { to, from } = dateRange || {};
        if (to !== undefined && from !== undefined) {
            setRange({
                from,
                to,
            });
        } else {
            setRange(undefined);
        }
    };

    const onClick = () => {
        if (!range) {
            return;
        }
        mutation.mutate(range, {
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
        <div className="flex flex-col gap-8">
            <BrutalCalendarRange selected={range} onSelect={onSelectRange} />
            <BrutalButton
                onClick={onClick}
                disabled={mutation.isPending || !range}
            >
                {mutation.isPending ? "Importing" : "Run import"}
            </BrutalButton>
        </div>
    );
}
