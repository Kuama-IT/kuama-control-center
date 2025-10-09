import { revalidatePath } from "next/cache";
import { Failure, isFailure } from "./server-action-utils";

export const serverActionUtils = {
  createSafeAction: <ReturnType, ArgsType extends unknown[]>(
    serverAction: (...args: ArgsType) => Promise<ReturnType>,
    revalidatePaths?: string[],
  ): ((...args: ArgsType) => Promise<ReturnType | Failure>) => {
    return async (...args: ArgsType) => {
      try {
        const result = await serverAction(...args);

        if (revalidatePaths && revalidatePaths?.length > 0) {
          for (const path of revalidatePaths) {
            revalidatePath(path);
          }
        }

        return result;
      } catch (error) {
        console.error(error);
        return _formatErrorForClient(error);
      }
    };
  },
};

function _formatErrorForClient(error: unknown): Failure {
  if (isFailure(error)) {
    return error;
  }

  return {
    type: "__failure__",
    message: JSON.stringify(error, null, 2),
  };
}
