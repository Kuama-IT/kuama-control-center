import { z } from "zod";

export const cashFlowCategoryUpdateSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, "Name is required"),
});

export type CashFlowCategoryUpdate = z.infer<
    typeof cashFlowCategoryUpdateSchema
>;
