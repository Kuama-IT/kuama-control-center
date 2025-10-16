"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { createInvoices } from "../invoices.actions";

export const useCreateInvoicesByFattureInCloudDtosMutation = () => {
    return useServerActionMutation({
        action: createInvoices,
    });
};
