"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import {
    createInvoices,
    importReceivedInvoicesByDateFromFattureInCloudAction,
} from "../invoices.actions";

export const useCreateInvoicesByFattureInCloudDtosMutation = () => {
    return useServerActionMutation({
        action: createInvoices,
    });
};

export const useImportReceivedInvoicesByDateFromFattureInCloudMutation = () => {
    return useServerActionMutation({
        action: importReceivedInvoicesByDateFromFattureInCloudAction,
    });
};
