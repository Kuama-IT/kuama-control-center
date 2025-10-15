import { ReactNode } from "react";
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
            className={`flex gap-4 text-3xl items-center ${brutalTheme.typography.heading}`}
        >
            {icon}
            {children}
        </h1>
    );
};
