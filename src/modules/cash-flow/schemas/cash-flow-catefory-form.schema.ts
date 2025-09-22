import { z } from "zod";

export const cashFlowCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["income", "expense"]),
});
export type CashFlowCategoryForm = z.infer<typeof cashFlowCategoryFormSchema>;