import { Failure } from "@/utils/server-action-utils";
import { cn } from "@/lib/utils";
import { brutalTheme } from "@/modules/ui";

export const ErrorMessage = ({ failure }: { failure: Failure }) => (
  <div
    className={cn("font-mono text-center text-sm", brutalTheme.text.primary)}
  >
    <pre>{failure.message}</pre>
  </div>
);
