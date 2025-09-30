import React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brutalTheme, brutalUtils, cn } from "../brutal-theme";

// Brutal Input Component
export interface BrutalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const BrutalInput: React.FC<BrutalInputProps> = ({
  className,
  ...props
}) => {
  return (
    <ShadcnInput
      className={cn(brutalUtils.inputBase(), className)}
      {...props}
    />
  );
};

// Brutal Label Component
export interface BrutalLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const BrutalLabel: React.FC<BrutalLabelProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <ShadcnLabel
      className={cn(brutalTheme.typography.caption, className)}
      {...props}
    >
      {children}
    </ShadcnLabel>
  );
};

// Brutal Checkbox Component
export interface BrutalCheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const BrutalCheckbox: React.FC<BrutalCheckboxProps> = ({
  className,
  ...props
}) => {
  return (
    <ShadcnCheckbox
      className={cn(
        "h-8 w-8",
        brutalTheme.borders.medium,
        "data-[state=checked]:bg-black data-[state=checked]:text-white",
        brutalTheme.base.sharp,
        brutalTheme.shadows.sm,
        "focus:shadow-[6px_6px_0px_0px_#333333]",
        brutalTheme.base.interactive,
        className
      )}
      {...props}
    />
  );
};

// Brutal Badge Component
export interface BrutalBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

export const BrutalBadge: React.FC<BrutalBadgeProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const variants = {
    default: "bg-gray-500 text-white border-black",
    success: "bg-green-500 text-white border-black",
    warning: "bg-yellow-500 text-black border-black",
    error: "bg-red-500 text-white border-black",
    info: "bg-blue-500 text-white border-black",
  };

  return (
    <ShadcnBadge
      className={cn(
        variants[variant],
        brutalTheme.borders.medium,
        "font-bold uppercase px-4 py-2",
        brutalTheme.shadows.sm,
        brutalTheme.base.sharp,
        className
      )}
    >
      {children}
    </ShadcnBadge>
  );
};

// Brutal Select Component
export interface BrutalSelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const BrutalSelect: React.FC<BrutalSelectProps> = ({
  children,
  placeholder,
  className,
  ...props
}) => {
  return (
    <Select {...props}>
      <SelectTrigger
        className={cn(
          "bg-white",
          brutalTheme.borders.thick,
          "text-black text-xl font-bold",
          brutalTheme.spacing.input,
          "focus:outline-none focus:ring-0 focus:border-red-500",
          brutalTheme.transitions.normal,
          brutalTheme.shadows.lg,
          "focus:shadow-[12px_12px_0px_0px_#333333]",
          brutalTheme.base.sharp,
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "bg-white",
          brutalTheme.borders.medium,
          brutalTheme.shadows.lg,
          brutalTheme.base.sharp
        )}
      >
        {children}
      </SelectContent>
    </Select>
  );
};

export const BrutalSelectItem: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ children, className, ...props }) => {
  return (
    <SelectItem
      className={cn(
        "font-bold text-lg uppercase tracking-wide",
        "focus:bg-black focus:text-white",
        brutalTheme.transitions.fast,
        className
      )}
      {...props}
    >
      {children}
    </SelectItem>
  );
};

// Form Field Wrapper
export interface BrutalFormFieldProps {
  label: string;
  children: React.ReactNode;
  description?: string;
  error?: string;
  className?: string;
}

export const BrutalFormField: React.FC<BrutalFormFieldProps> = ({
  label,
  children,
  description,
  error,
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <BrutalLabel>{label}</BrutalLabel>
      {children}
      {description && (
        <p className={cn(brutalTheme.typography.caption, "text-gray-600")}>
          {description}
        </p>
      )}
      {error && (
        <p className={cn(brutalTheme.typography.caption, "text-red-500")}>
          {error}
        </p>
      )}
    </div>
  );
};
