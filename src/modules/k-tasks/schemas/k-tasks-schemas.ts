import { z } from "zod";
import { KSupportedPlatforms } from "@/modules/k-platform-credentials/schemas/k-platform-credentials-schemas";

export const kTaskReadSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  projectId: z.number(),
  platform: KSupportedPlatforms,
  externalTrackerId: z.string().nullable(),
  employeeId: z.number(),
  creationDate: z.string().nullable(),
});
export type KTaskRead = z.infer<typeof kTaskReadSchema>;
