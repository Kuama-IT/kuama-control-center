"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type CashFlowCategoryRead } from "../schemas/cash-flow-category-read";

type CategorySelectorProps = {
    categories: CashFlowCategoryRead[];
    selectedCategoryId?: number | null;
    transactionType: "income" | "expense";
    onCategorySelect: (categoryId: number | null) => void;
    onCategoryCreate?: (category: {
        name: string;
        type: "income" | "expense";
    }) => Promise<CashFlowCategoryRead>;
    placeholder?: string;
    className?: string;
};

export function CategorySelector({
    categories,
    selectedCategoryId,
    transactionType,
    onCategorySelect,
    onCategoryCreate,
    placeholder = "Select category...",
    className,
}: CategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryType, setNewCategoryType] = useState<
        "income" | "expense"
    >(transactionType);
    const [isCreating, setIsCreating] = useState(false);

    const filteredCategories = categories.filter(
        (category) => category.type === transactionType,
    );

    const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId,
    );

    const handleCreateCategory = async () => {
        if (!(newCategoryName.trim() && onCategoryCreate)) return;

        setIsCreating(true);
        try {
            const newCategory = await onCategoryCreate({
                name: newCategoryName.trim(),
                type: newCategoryType,
            });
            onCategorySelect(newCategory.id);
            setNewCategoryName("");
            setNewCategoryType(transactionType); // Reset to default
            setShowCreateDialog(false);
            setOpen(false);
        } catch (error) {
            console.error("Failed to create category:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const categoryNameId = useId();

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between", className)}
                    >
                        {selectedCategory ? selectedCategory.name : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    value=""
                                    onSelect={() => {
                                        onCategorySelect(null);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCategoryId === null
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    None
                                </CommandItem>
                                {filteredCategories.map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        onSelect={() => {
                                            onCategorySelect(category.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedCategoryId ===
                                                    category.id
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        {category.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {onCategoryCreate && (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => {
                                                setNewCategoryName("");
                                                setNewCategoryType(
                                                    transactionType,
                                                );
                                                setShowCreateDialog(true);
                                                setOpen(false);
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create new category
                                        </CommandItem>
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Create Category Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                            Create a new category for your transactions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor={categoryNameId}
                                className="text-right"
                            >
                                Name
                            </Label>
                            <Input
                                id={categoryNameId}
                                value={newCategoryName}
                                onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                }
                                placeholder="Enter category name"
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateCategory();
                                    }
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select
                                value={newCategoryType}
                                onValueChange={(value: "income" | "expense") =>
                                    setNewCategoryType(value)
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">
                                        Income
                                    </SelectItem>
                                    <SelectItem value="expense">
                                        Expense
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim() || isCreating}
                        >
                            {isCreating ? "Creating..." : "Create Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
