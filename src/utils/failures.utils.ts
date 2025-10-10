import z from "zod";

const failureSchema = z.object({
  type: z.literal("__failure__"),
  code: z.string().optional(),
  message: z.string(),
});

export const isFailure = (value: unknown): value is Failure => {
  return failureSchema.safeParse(value).success;
};

export type Failure = z.infer<typeof failureSchema>;
