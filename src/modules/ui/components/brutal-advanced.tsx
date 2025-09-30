import React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { brutalTheme, cn } from "../brutal-theme";

// Brutal Calendar Component
export interface BrutalCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

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
      brutalTheme.base.sharp
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
      "cursor-pointer flex items-center justify-center"
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
      "cursor-pointer text-center leading-12"
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

// Brutal Command Component
export interface BrutalCommandProps {
  children: React.ReactNode;
  className?: string;
}

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
        className
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
        "border-0 border-b-4 border-black px-6 py-4 font-bold text-lg",
        "focus:outline-none",
        brutalTheme.base.sharp,
        "bg-white",
        className
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
        "px-6 py-4 font-bold hover:bg-black hover:text-white cursor-pointer",
        brutalTheme.transitions.fast,
        "border-b-2 border-gray-200 last:border-b-0",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
};

// Brutal Dialog Components
export interface BrutalDialogProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title: string;
  description?: string;
}

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
          brutalTheme.base.sharp
        )}
      >
        <DialogHeader>
          <DialogTitle className="font-black text-3xl uppercase tracking-wider mb-4">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="font-bold text-lg text-gray-700 mb-6">
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
export interface BrutalPopoverProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
}

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
          "px-4 py-2 cursor-pointer",
          brutalTheme.base.sharp
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
          className
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

// Brutal Hover Card Component
export interface BrutalHoverCardProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
}

export const BrutalHoverCard: React.FC<BrutalHoverCardProps> = ({
  children,
  trigger,
  className,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "border-b-2 border-black font-bold cursor-pointer",
          "hover:bg-black hover:text-white",
          brutalTheme.transitions.fast,
          "px-2 py-1"
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
          className
        )}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  );
};

// Brutal Dropdown Menu Component
export interface BrutalDropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
}

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
          "px-4 py-2 cursor-pointer",
          brutalTheme.base.sharp
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
          className
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
        "px-4 py-3 font-bold hover:bg-black hover:text-white cursor-pointer",
        brutalTheme.transitions.fast,
        "uppercase",
        className
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
        "px-4 py-2 font-black uppercase text-sm tracking-wider bg-gray-100",
        className
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
      className={cn("border-t-2 border-black my-2", className)}
    />
  );
};

// Brutal Avatar Component
export interface BrutalAvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

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
        className
      )}
    >
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback className="bg-black text-white font-black text-xl">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};
