import { z } from "zod";
import { SupportedPlatforms } from "@/modules/platform-credentials/schemas/platform-credentials.schemas";

export const taskReadSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  projectId: z.number(),
  platform: SupportedPlatforms,
  externalTrackerId: z.string().nullable(),
  employeeId: z.number(),
  creationDate: z.string().nullable(),
});

export type TaskRead = z.infer<typeof taskReadSchema>;

// Temporary aliases to smooth migration from k-tasks
export { taskReadSchema as kTaskReadSchema };
export type { TaskRead as KTaskRead };
