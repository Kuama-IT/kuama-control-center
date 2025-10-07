"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { isFailure, type Failure } from "@/utils/server-action-utils";

export function useServerActionMutation<
  TData,
  TVariables = void,
  TContext = unknown,
>(
  action: (variables: TVariables) => Promise<TData | Failure>,
  options?: UseMutationOptions<TData, Failure, TVariables, TContext>
): UseMutationResult<TData, Failure, TVariables, TContext> {
  return useMutation<TData, Failure, TVariables, TContext>({
    mutationFn: async (variables) => {
      const result = await action(variables);

      if (isFailure(result)) {
        throw result;
      }

      return result;
    },
    ...options,
  });
}
