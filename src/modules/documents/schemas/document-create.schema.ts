import { z } from "zod";
export const createDocumentSchema = z.object({
  content: z.instanceof(Buffer),
  sizeInBytes: z.number().min(0),
  sha256: z.string().length(64),
  mime: z.string().min(3).max(100),
  fileName: z.string().min(2).max(100),
  extension: z.string().min(2).max(10),
});

export type DocumentCreateDto = z.infer<typeof createDocumentSchema>;
