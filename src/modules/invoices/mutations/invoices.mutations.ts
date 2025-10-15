"use client";

import { useMutation } from "@tanstack/react-query";
import { createInvoices } from "../invoices.actions";
export const useCreateInvoicesByFattureInCloudDtosMutation = () => {
    return useMutation({
        mutationFn: createInvoices,
    });
};
