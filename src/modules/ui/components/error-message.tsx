import { cn } from "@/lib/utils";
import { brutalTheme } from "@/modules/ui";
import { type Failure } from "@/utils/server-action-utils";

export const ErrorMessage = ({ failure }: { failure: Failure }) => (
    <div
        className={cn(
            "text-center font-mono text-sm",
            brutalTheme.text.primary,
        )}
    >
        <pre>{failure.message}</pre>
    </div>
);
