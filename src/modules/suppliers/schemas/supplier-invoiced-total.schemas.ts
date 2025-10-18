import { z } from "zod";

export const supplierInvoicedTotalSchema = z.object({
    net: z.number(),
    gross: z.number(),
    vat: z.number(),
});

export const supplierInvoicedTotalRequestSchema = z.object({
    id: z.number(),
    year: z.number().optional(),
});

export type SupplierInvoicedTotalDto = z.infer<
    typeof supplierInvoicedTotalSchema
>;

export type SupplierInvoicedTotalRequestDto = z.infer<
    typeof supplierInvoicedTotalRequestSchema
>;
