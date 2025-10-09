import type { Failure } from "@/utils/server-action-utils";

export const isFailure = (value: unknown): value is Failure => {
  return failureSchema.safeParse(value).success;
};
