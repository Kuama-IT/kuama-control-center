import type React from "react";
import { type DateRange } from "react-day-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandInput, CommandItem } from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { brutalTheme, cn } from "@/modules/ui";

// Brutal Calendar Component
export type BrutalCalendarProps = {
    selected?: Date;
    onSelect?: (date: Date | undefined) => void;
    className?: string;
};
// Brutal Calendar Component
export type BrutalCalendarRangeProps = {
    selected?: DateRange;
    onSelect?: (date: DateRange | undefined) => void;
    className?: string;
    today?: Date | undefined;
    defaultMonth?: Date | undefined;
    numberOfMonths?: number;
};

export const BrutalCalendar: React.FC<BrutalCalendarProps> = ({
    selected,
    onSelect,
    className,
}) => {
    const calendarClasses = {
        container: cn(
            brutalTheme.borders.medium,
            brutalTheme.shadows.lg,
            "bg-white p-4",
            brutalTheme.base.sharp,
        ),
        months: "space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "font-black text-lg uppercase tracking-wider",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
            "h-10 w-10 bg-white hover:bg-black hover:text-white",
            "border-2 border-black font-bold",
            brutalTheme.transitions.fast,
            brutalTheme.base.sharp,
            "cursor-pointer flex items-center justify-center",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "",
        head_cell: "text-black font-black uppercase text-sm text-center p-2",
        row: "",
        cell: "text-center p-0 relative",
        day: cn(
            "h-12 w-12 border-2 border-black font-bold",
            "hover:bg-black hover:text-white",
            brutalTheme.transitions.fast,
            brutalTheme.base.sharp,
            "cursor-pointer text-center leading-12",
        ),
        day_selected: "bg-black text-white border-black",
        day_today: "bg-red-500 text-white border-red-500",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-black",
        day_hidden: "invisible",
    };

    return (
        <Calendar
            mode="single"
            selected={selected}
            onSelect={onSelect}
            className={cn(calendarClasses.container, className)}
            classNames={calendarClasses}
        />
    );
};

export const BrutalCalendarRange: React.FC<BrutalCalendarRangeProps> = ({
    selected,
    onSelect,
    className,
    today,
    defaultMonth,
    numberOfMonths = 2,
}) => {
    const calendarClasses = {
        container: cn(
            brutalTheme.borders.medium,
            brutalTheme.shadows.lg,
            "bg-white p-4 flex gap-8",
            brutalTheme.base.sharp,
        ),
        // months: "space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "font-black text-lg uppercase tracking-wider",
        // nav: "space-x-1 flex items-center",
        nav_button: cn(
            "h-10 w-10 bg-white hover:bg-black hover:text-white",
            "border-2 border-black font-bold",
            brutalTheme.transitions.fast,
            brutalTheme.base.sharp,
            "cursor-pointer flex items-center justify-center",
        ),
        // nav_button_previous: "absolute left-1",
        // nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "",
        head_cell: "text-black font-black uppercase text-sm text-center p-2",
        row: "",
        cell: "text-center p-0 relative",
        // day: cn(
        //     "h-12 w-12 border-2 border-black font-bold border-r-0",
        //     "hover:bg-black hover:text-white",
        //     brutalTheme.transitions.fast,
        //     brutalTheme.base.sharp,
        //     "cursor-pointer text-center leading-12",
        // ),
        day_selected: "bg-black text-white border-black",
        day_today: "bg-red-500 text-white border-red-500",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-black",
        day_hidden: "invisible",
    };

    return (
        <Calendar
            today={today}
            defaultMonth={defaultMonth}
            numberOfMonths={numberOfMonths}
            mode="range"
            selected={selected}
            onSelect={onSelect}
            className={cn(calendarClasses.container, className)}
            classNames={calendarClasses}
        />
    );
};

// Brutal Command Component
export type BrutalCommandProps = {
    children: React.ReactNode;
    className?: string;
};

export const BrutalCommand: React.FC<BrutalCommandProps> = ({
    children,
    className,
}) => {
    return (
        <Command
            className={cn(
                brutalTheme.borders.medium,
                brutalTheme.shadows.lg,
                "bg-white",
                brutalTheme.base.sharp,
                className,
            )}
        >
            {children}
        </Command>
    );
};

export const BrutalCommandInput: React.FC<{
    placeholder?: string;
    className?: string;
}> = ({ placeholder, className }) => {
    return (
        <CommandInput
            placeholder={placeholder}
            className={cn(
                "border-0 border-black border-b-4 px-6 py-4 font-bold text-lg",
                "focus:outline-none",
                brutalTheme.base.sharp,
                "bg-white",
                className,
            )}
        />
    );
};

export const BrutalCommandItem: React.FC<{
    children: React.ReactNode;
    className?: string;
    onSelect?: () => void;
}> = ({ children, className, ...props }) => {
    return (
        <CommandItem
            className={cn(
                "cursor-pointer px-6 py-4 font-bold hover:bg-black hover:text-white",
                brutalTheme.transitions.fast,
                "border-gray-200 border-b-2 last:border-b-0",
                className,
            )}
            {...props}
        >
            {children}
        </CommandItem>
    );
};

// Brutal Dialog Components
export type BrutalDialogProps = {
    children: React.ReactNode;
    trigger: React.ReactNode;
    title: string;
    description?: string;
};

export const BrutalDialog: React.FC<BrutalDialogProps> = ({
    children,
    trigger,
    title,
    description,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                className={cn(
                    brutalTheme.borders.thick,
                    brutalTheme.shadows.xl,
                    "bg-white p-8",
                    brutalTheme.base.sharp,
                )}
            >
                <DialogHeader>
                    <DialogTitle className="mb-4 font-black text-3xl uppercase tracking-wider">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="mb-6 font-bold text-gray-700 text-lg">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

// Brutal Popover Component
export type BrutalPopoverProps = {
    children: React.ReactNode;
    trigger: React.ReactNode;
    className?: string;
};

export const BrutalPopover: React.FC<BrutalPopoverProps> = ({
    children,
    trigger,
    className,
}) => {
    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    brutalTheme.borders.medium,
                    "font-bold hover:bg-black hover:text-white",
                    brutalTheme.transitions.fast,
                    "cursor-pointer px-4 py-2",
                    brutalTheme.base.sharp,
                )}
            >
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    brutalTheme.borders.medium,
                    brutalTheme.shadows.lg,
                    "bg-white p-6",
                    brutalTheme.base.sharp,
                    className,
                )}
            >
                {children}
            </PopoverContent>
        </Popover>
    );
};

// Brutal Hover Card Component
export type BrutalHoverCardProps = {
    children: React.ReactNode;
    trigger: React.ReactNode;
    className?: string;
};

export const BrutalHoverCard: React.FC<BrutalHoverCardProps> = ({
    children,
    trigger,
    className,
}) => {
    return (
        <HoverCard>
            <HoverCardTrigger
                className={cn(
                    "cursor-pointer border-black border-b-2 font-bold",
                    "hover:bg-black hover:text-white",
                    brutalTheme.transitions.fast,
                    "px-2 py-1",
                )}
            >
                {trigger}
            </HoverCardTrigger>
            <HoverCardContent
                className={cn(
                    brutalTheme.borders.medium,
                    brutalTheme.shadows.md,
                    "bg-white p-4",
                    brutalTheme.base.sharp,
                    className,
                )}
            >
                {children}
            </HoverCardContent>
        </HoverCard>
    );
};

// Brutal Dropdown Menu Component
export type BrutalDropdownMenuProps = {
    children: React.ReactNode;
    trigger: React.ReactNode;
    className?: string;
};

export const BrutalDropdownMenu: React.FC<BrutalDropdownMenuProps> = ({
    children,
    trigger,
    className,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    brutalTheme.borders.medium,
                    "font-bold hover:bg-black hover:text-white",
                    brutalTheme.transitions.fast,
                    "cursor-pointer px-4 py-2",
                    brutalTheme.base.sharp,
                )}
            >
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={cn(
                    brutalTheme.borders.medium,
                    brutalTheme.shadows.lg,
                    "bg-white p-2",
                    brutalTheme.base.sharp,
                    className,
                )}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const BrutalDropdownMenuItem: React.FC<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}> = ({ children, className, ...props }) => {
    return (
        <DropdownMenuItem
            className={cn(
                "cursor-pointer px-4 py-3 font-bold hover:bg-black hover:text-white",
                brutalTheme.transitions.fast,
                "uppercase",
                className,
            )}
            {...props}
        >
            {children}
        </DropdownMenuItem>
    );
};

export const BrutalDropdownMenuLabel: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <DropdownMenuLabel
            className={cn(
                "bg-gray-100 px-4 py-2 font-black text-sm uppercase tracking-wider",
                className,
            )}
        >
            {children}
        </DropdownMenuLabel>
    );
};

export const BrutalDropdownMenuSeparator: React.FC<{
    className?: string;
}> = ({ className }) => {
    return (
        <DropdownMenuSeparator
            className={cn("my-2 border-black border-t-2", className)}
        />
    );
};

// Brutal Avatar Component
export type BrutalAvatarProps = {
    src?: string;
    alt?: string;
    fallback: string;
    size?: "sm" | "md" | "lg";
    className?: string;
};

export const BrutalAvatar: React.FC<BrutalAvatarProps> = ({
    src,
    alt,
    fallback,
    size = "md",
    className,
}) => {
    const sizes = {
        sm: "h-12 w-12",
        md: "h-16 w-16",
        lg: "h-20 w-20",
    };

    return (
        <Avatar
            className={cn(
                sizes[size],
                brutalTheme.borders.medium,
                brutalTheme.shadows.sm,
                brutalTheme.base.sharp,
                "bg-gray-100",
                className,
            )}
        >
            {src && <AvatarImage src={src} alt={alt} />}
            <AvatarFallback className="bg-black font-black text-white text-xl">
                {fallback}
            </AvatarFallback>
        </Avatar>
    );
};
