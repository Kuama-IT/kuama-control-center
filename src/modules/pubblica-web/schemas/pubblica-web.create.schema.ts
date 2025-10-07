import z from "zod";

const createPubblicaWebDocumentSchema = z.object({
  year: z.number().int().min(2021),
  month: z.number().int().min(1).max(12),
});

export type CreatePubblicaWebMonthlyBalanceDto = z.infer<
  typeof createPubblicaWebDocumentSchema
>;

export type CreatePubblicaWebPayslipsDto = z.infer<
  typeof createPubblicaWebDocumentSchema
>;
