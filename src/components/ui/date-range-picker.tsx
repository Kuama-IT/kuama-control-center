"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateRangePickerProps = {
    from: Date;
    to: Date;
    onFromChange: (date: Date) => void;
    onToChange: (date: Date) => void;
    title?: string;
    statusText?: string;
    className?: string;
};

export function DateRangePicker({
    from,
    to,
    onFromChange,
    onToChange,
    title = "Date Range",
    statusText,
    className,
}: DateRangePickerProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center",
                className,
            )}
        >
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <h2 className="font-semibold text-lg">{title}</h2>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                    <span className="text-muted-foreground text-sm">
                        Date range:
                    </span>
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[140px] justify-start text-left font-normal",
                                        !from && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {from
                                        ? format(from, "dd/MM/yyyy")
                                        : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={from}
                                    onSelect={(date) =>
                                        date && onFromChange(date)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <span className="text-muted-foreground">to</span>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[140px] justify-start text-left font-normal",
                                        !to && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {to
                                        ? format(to, "dd/MM/yyyy")
                                        : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={to}
                                    onSelect={(date) =>
                                        date && onToChange(date)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {statusText && (
                <div className="text-muted-foreground text-sm">
                    {statusText}
                </div>
            )}
        </div>
    );
}
