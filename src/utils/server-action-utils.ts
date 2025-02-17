import { z } from "zod";

const failureSchema = z.object({
  type: z.literal("__failure__"),
  code: z.ostring(),
  message: z.string(),
});

export type Failure = z.infer<typeof failureSchema>;

export const isFailure = (value: unknown): value is Failure => {
  return failureSchema.safeParse(value).success;
};

export const handleServerErrors = <ReturnType, ArgsType extends unknown[]>(
  serverAction: (...args: ArgsType) => Promise<ReturnType>,
): ((...args: ArgsType) => Promise<ReturnType | Failure>) => {
  return async (...args: ArgsType) => {
    try {
      return await serverAction(...args);
    } catch (error) {
      console.error(error);
      return {
        type: "__failure__",
        message: JSON.stringify(error),
      };
    }
  };
};
