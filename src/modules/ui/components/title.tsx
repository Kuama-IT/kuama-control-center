import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { brutalTheme } from "@/modules/ui";

export const Title = ({
    icon,
    children,
    className = "",
}: {
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}) => {
    return (
        <h1
            className={cn(
                className,
                `flex items-center gap-4 text-3xl ${brutalTheme.typography.heading}`,
            )}
        >
            {icon}
            {children}
        </h1>
    );
};
