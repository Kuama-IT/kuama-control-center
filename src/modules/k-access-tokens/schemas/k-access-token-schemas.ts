import { z } from "zod";

export const kAccessTokenSchemaRead = z.object({
  id: z.number(),
  token: z.string(),
  purpose: z.string(),
  createdAt: z.date(),
  expiresAt: z.date().nullable(),
  allowedUsages: z.number().default(-1).nullable(),
  usageCount: z.number().default(0).nullable(),
});
export const kAccessTokenSchemaCreate = kAccessTokenSchemaRead.omit({
  token: true,
  createdAt: true,
  usageCount: true,
  id: true,
});
export type KAccessTokenRead = z.infer<typeof kAccessTokenSchemaRead>;
export type KAccessTokenCreate = z.infer<typeof kAccessTokenSchemaCreate>;
