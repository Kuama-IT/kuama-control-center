import { z } from "zod";

export const projectAddImagesSchema = z.object({
    projectId: z.number().int(),
    images: z.array(z.string().min(1)),
});

export type ProjectAddImagesInput = z.infer<typeof projectAddImagesSchema>;
