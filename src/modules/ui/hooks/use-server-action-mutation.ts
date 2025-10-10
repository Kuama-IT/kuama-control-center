"use client";

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  type InvalidateQueryFilters,
  useQueryClient,
} from "@tanstack/react-query";
import { isFailure, type Failure } from "@/utils/server-action-utils";

export function useServerActionMutation<
  TData,
  TVariables = void,
  TContext = unknown,
>(
  {
    action,
    invalidateQueries,
  }: {
    action: (variables: TVariables) => Promise<TData | Failure>;
    invalidateQueries?: InvalidateQueryFilters<readonly unknown[]>;
  },
  options?: UseMutationOptions<TData, Failure, TVariables, TContext>,
): UseMutationResult<TData, Failure, TVariables, TContext> {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};
  return useMutation<TData, Failure, TVariables, TContext>({
    mutationFn: async (variables) => {
      const result = await action(variables);

      if (isFailure(result)) {
        throw result;
      }

      return result;
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      if (invalidateQueries) {
        queryClient.invalidateQueries(invalidateQueries);
      }

      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...rest,
  });
}
