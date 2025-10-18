import type React from "react";
import { type CSSProperties } from "react";
import { Separator as ShadcnSeparator } from "@/components/ui/separator";
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { brutalTheme, brutalUtils, cn } from "@/modules/ui";

// Brutal Card Component
export type BrutalCardProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
    className?: string;
    style?: CSSProperties;
};

export const BrutalCard: React.FC<BrutalCardProps> = ({
    children,
    variant = "primary",
    className,
    style,
}) => {
    const variants = {
        primary: brutalUtils.cardBase(),
        secondary: cn(
            "bg-gray-100",
            brutalTheme.borders.medium,
            "shadow-[6px_6px_0px_0px_#333333]",
            "p-4",
            brutalTheme.base.sharp,
        ),
        danger: cn(brutalUtils.cardBase(), brutalTheme.borders.accent),
    };

    return (
        <div style={style} className={cn(variants[variant], className)}>
            {children}
        </div>
    );
};

// Brutal Table Components
export type BrutalTableProps = {
    children: React.ReactNode;
    caption?: string;
    className?: string;
};

export const BrutalTable: React.FC<BrutalTableProps> = ({
    children,
    caption,
    className,
}) => {
    return (
        <Table
            className={cn(
                brutalTheme.borders.medium,
                brutalTheme.shadows.lg,
                "bg-white",
                brutalTheme.base.sharp,
                className,
            )}
        >
            {caption && (
                <TableCaption className="mt-6 font-bold text-black text-lg uppercase">
                    {caption}
                </TableCaption>
            )}
            {children}
        </Table>
    );
};

export const BrutalTableHeader: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <TableHeader className="border-black border-b-4 bg-gray-100">
            {children}
        </TableHeader>
    );
};

export const BrutalTableRow: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <TableRow
            className={cn(
                "border-black border-b-2 hover:bg-gray-50",
                brutalTheme.transitions.fast,
                className,
            )}
        >
            {children}
        </TableRow>
    );
};

export const BrutalTableHead: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <TableHead
            className={cn(
                "border-black border-r-2 p-6 font-black text-lg uppercase last:border-r-0",
                className,
            )}
        >
            {children}
        </TableHead>
    );
};

export const BrutalTableCell: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <TableCell
            className={cn(
                "border-black border-r-2 p-6 font-bold last:border-r-0",
                className,
            )}
        >
            {children}
        </TableCell>
    );
};

// Brutal Separator
export type BrutalSeparatorProps = {
    orientation?: "horizontal" | "vertical";
    className?: string;
};

export const BrutalSeparator: React.FC<BrutalSeparatorProps> = ({
    orientation = "horizontal",
    className,
}) => {
    return (
        <ShadcnSeparator
            orientation={orientation}
            className={cn(
                orientation === "horizontal" ? "border-t-4" : "border-l-4",
                "border-black",
                className,
            )}
        />
    );
};

// Brutal Skeleton Components
export type BrutalSkeletonProps = {
    variant?: "default" | "avatar" | "text";
    className?: string;
};

export const BrutalSkeleton: React.FC<BrutalSkeletonProps> = ({
    variant = "default",
    className,
}) => {
    const variants = {
        default: "bg-gray-300 border-2 border-black",
        avatar: "bg-gray-300 border-4 border-black",
        text: "bg-gray-300 border-2 border-black",
    };

    return (
        <ShadcnSkeleton
            className={cn(variants[variant], brutalTheme.base.sharp, className)}
        />
    );
};

// Layout Components
export type BrutalContainerProps = {
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    className?: string;
};

export const BrutalContainer: React.FC<BrutalContainerProps> = ({
    children,
    size = "lg",
    className,
}) => {
    const sizes = {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-full",
    };

    return (
        <div className={cn("mx-auto px-6", sizes[size], className)}>
            {children}
        </div>
    );
};

export type BrutalSectionProps = {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
};

export const BrutalSection: React.FC<BrutalSectionProps> = ({
    children,
    title,
    subtitle,
    className,
}) => {
    return (
        <section className={cn("space-y-8", className)}>
            {title && (
                <div className="space-y-2">
                    <h2 className={brutalTheme.typography.heading}>{title}</h2>
                    {subtitle && (
                        <p
                            className={cn(
                                brutalTheme.typography.body,
                                "text-gray-700",
                            )}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            {children}
        </section>
    );
};
