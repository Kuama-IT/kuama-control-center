import { z } from "zod";

export const kClientReadSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  youTrackRingId: z.string().nullable(),
});

export type KClientRead = z.infer<typeof kClientReadSchema>;

export const kVatsSchema = z.object({
  id: z.number(),
  vat: z.string(),
  companyName: z.string(),
  fattureInCloudId: z.string().nullable(),
});
export type KVatRead = z.infer<typeof kVatsSchema>;
