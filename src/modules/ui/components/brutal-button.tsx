import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { brutalTheme, brutalUtils, cn } from "../brutal-theme";

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: cn(
      "bg-black text-white",
      brutalTheme.borders.thick,
      "hover:bg-white hover:text-black",
      brutalTheme.shadows.button.primary,
      brutalTheme.shadows.hover.primary,
      brutalUtils.hoverTransform("primary"),
    ),
    secondary: cn(
      "bg-white text-black",
      brutalTheme.borders.thick,
      "hover:bg-white hover:text-black hover:border-white",
      brutalTheme.shadows.button.secondary,
      brutalTheme.shadows.hover.secondary,
      brutalUtils.hoverTransform("secondary"),
    ),
    danger: cn(
      "bg-red-500 text-white",
      brutalTheme.borders.thick,
      "hover:bg-red-500 hover:text-white hover:border-red-500",
      brutalTheme.shadows.button.danger,
      brutalTheme.shadows.hover.danger,
      brutalUtils.hoverTransform("danger"),
    ),
    ghost: cn("bg-transparent text-black"),
  };

  return (
    <ShadcnButton
      className={cn(brutalUtils.buttonBase(size), variants[variant], className)}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

// Specialized button variants for common use cases
export const BrutalPrimaryButton: React.FC<
  Omit<BrutalButtonProps, "variant">
> = (props) => <BrutalButton variant="primary" {...props} />;

export const BrutalSecondaryButton: React.FC<
  Omit<BrutalButtonProps, "variant">
> = (props) => <BrutalButton variant="secondary" {...props} />;

export const BrutalDangerButton: React.FC<
  Omit<BrutalButtonProps, "variant">
> = (props) => <BrutalButton variant="danger" {...props} />;
