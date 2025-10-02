import { z } from "zod";

export const accessTokenReadSchema = z.object({
  id: z.number(),
  token: z.string(),
  purpose: z.string(),
  createdAt: z.date(),
  expiresAt: z.date().nullable(),
  allowedUsages: z.number().default(-1).nullable(),
  usageCount: z.number().default(0).nullable(),
});
export const accessTokenCreateSchema = accessTokenReadSchema.omit({
  token: true,
  createdAt: true,
  usageCount: true,
  id: true,
});
export type AccessTokenRead = z.infer<typeof accessTokenReadSchema>;
export type AccessTokenCreate = z.infer<typeof accessTokenCreateSchema>;

export const accessTokenCreateResultSchema = z.object({
  message: z.string(),
  data: accessTokenReadSchema,
});
export type AccessTokenCreateResult = z.infer<
  typeof accessTokenCreateResultSchema
>;

export const accessTokenDeleteResultSchema = z.object({
  message: z.string(),
});
export type AccessTokenDeleteResult = z.infer<
  typeof accessTokenDeleteResultSchema
>;

export const accessTokenListResultSchema = z.array(accessTokenReadSchema);
export type AccessTokenListResult = z.infer<typeof accessTokenListResultSchema>;
