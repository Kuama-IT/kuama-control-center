import { z } from "zod";

export const clientReadSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  youTrackRingId: z.string().nullable(),
});

export type ClientRead = z.infer<typeof clientReadSchema>;

export const vatsSchema = z.object({
  id: z.number(),
  vat: z.string(),
  companyName: z.string(),
  fattureInCloudId: z.string().nullable(),
});
export type VatRead = z.infer<typeof vatsSchema>;
