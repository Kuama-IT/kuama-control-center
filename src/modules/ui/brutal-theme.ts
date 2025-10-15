/**
 * Brutal Design System - Core Theme Configuration
 * Industrial-strength UI with sharp edges, high contrast, and bold typography
 */

export const brutalTheme = {
    // Core Colors
    colors: {
        primary: {
            black: "#000000",
            white: "#ffffff",
            accent: "#ef4444", // red-500
            success: "#22c55e", // green-500
            warning: "#eab308", // yellow-500
            error: "#ef4444", // red-500
            info: "#3b82f6", // blue-500
        },
        neutral: {
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
        },
    },

    // Border Configurations
    borders: {
        thin: "border-2 border-black",
        medium: "border-4 border-black",
        thick: "border-6 border-black",
        accent: "border-4 border-red-500",
        white: "border-4 border-white",
    },

    // Shadow Systems
    shadows: {
        sm: "shadow-[4px_4px_0px_0px_#333333]",
        md: "shadow-[6px_6px_0px_0px_#333333]",
        lg: "shadow-[8px_8px_0px_0px_#333333]",
        xl: "shadow-[12px_12px_0px_0px_#333333]",

        // Stacked shadows for buttons
        button: {
            primary:
                "shadow-[12px_8px_0px_0px_#666666,6px_4px_0px_0px_#999999]",
            secondary:
                "shadow-[8px_12px_0px_0px_#666666,4px_6px_0px_0px_#999999]",
            danger: "shadow-[10px_10px_0px_0px_#333333,5px_5px_0px_0px_#666666]",
        },

        // Hover states
        hover: {
            primary:
                "hover:shadow-[6px_4px_0px_0px_#666666,3px_2px_0px_0px_#999999]",
            secondary:
                "hover:shadow-[4px_6px_0px_0px_#666666,2px_3px_0px_0px_#999999]",
            danger: "hover:shadow-[5px_5px_0px_0px_#333333,2px_2px_0px_0px_#666666]",
        },
    },

    // Typography Scale
    typography: {
        display:
            "font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none",
        heading: "font-black text-3xl uppercase tracking-wider",
        subheading: "font-bold text-2xl md:text-3xl uppercase tracking-wide",
        title: "font-black text-xl uppercase tracking-wider",
        subtitle: "font-bold text-lg uppercase",
        body: "font-bold text-base",
        caption: "font-bold text-sm uppercase tracking-wider",
        mono: "font-mono font-bold",
    },

    // Spacing System
    spacing: {
        button: {
            sm: "px-3 py-1",
            md: "px-6 py-3",
            lg: "px-8 py-6",
        },
        input: "px-6 py-6",
        card: "p-6",
        container: "p-4",
    },

    // Animation/Transitions
    transitions: {
        fast: "transition-all duration-150",
        normal: "transition-all duration-200",
        slow: "transition-all duration-300",
    },

    // Component Base Classes
    base: {
        sharp: "rounded-none",
        interactive: "cursor-pointer",
        disabled: "cursor-not-allowed opacity-50",
    },
} as const;

// Utility function to combine classes
export const cn = (...classes: (string | undefined | false)[]): string => {
    return classes.filter(Boolean).join(" ");
};

// Helper functions for common patterns
export const brutalUtils = {
    // Create button base classes
    buttonBase: (size: keyof typeof brutalTheme.spacing.button = "md") =>
        cn(
            brutalTheme.base.sharp,
            brutalTheme.base.interactive,
            brutalTheme.typography.subtitle,
            brutalTheme.spacing.button[size],
            brutalTheme.transitions.normal,
            "uppercase tracking-wider",
        ),

    // Create input base classes
    inputBase: () =>
        cn(
            "bg-white",
            brutalTheme.borders.thick,
            "text-black text-xl font-bold",
            brutalTheme.spacing.input,
            "focus:outline-none focus:ring-0 focus:border-red-500",
            brutalTheme.transitions.normal,
            brutalTheme.shadows.lg,
            "focus:shadow-[12px_12px_0px_0px_#333333]",
            "focus:translate-x-[-2px] focus:translate-y-[-2px]",
            brutalTheme.base.sharp,
        ),

    // Create card base classes
    cardBase: () =>
        cn(
            "bg-white",
            brutalTheme.borders.medium,
            brutalTheme.shadows.lg,
            brutalTheme.spacing.card,
            brutalTheme.base.sharp,
        ),

    // Create hover transforms
    hoverTransform: (
        direction: "primary" | "secondary" | "danger" = "primary",
    ) => {
        const transforms = {
            primary: "hover:translate-x-[6px] hover:translate-y-[4px]",
            secondary: "hover:translate-x-[4px] hover:translate-y-[6px]",
            danger: "hover:translate-x-[5px] hover:translate-y-[5px]",
        };
        return transforms[direction];
    },
};
