"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Transaction } from "../schemas/bank-statement-read";
import { CashFlowCategoryRead } from "../schemas/cash-flow-category-read";
import { CashFlowEntryRead } from "../schemas/cash-flow-entry-read";
import { CategorySelector } from "./category-selector";
import { handledCreateCashFlowEntriesFromTransactions } from "../cash-flow.actions";
import { Button } from "@/components/ui/button";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

type TransactionFilter = "all" | "incoming" | "outgoing";

interface BankTransactionsTableProps {
    cashFlowCategories: CashFlowCategoryRead[];
    transactions: Transaction[];
    existingCashFlowEntries: CashFlowEntryRead[];
    onCategoryCreate?: (category: {
        name: string;
        type: "income" | "expense";
    }) => Promise<CashFlowCategoryRead>;
}

export default function BankTransactionsTable({
    transactions,
    cashFlowCategories,
    existingCashFlowEntries,
    onCategoryCreate,
}: BankTransactionsTableProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<TransactionFilter>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [hideImported, setHideImported] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
        null,
    );
    const [transactionCategories, setTransactionCategories] = useState<
        Map<number, number | null>
    >(new Map());
    const [allCategories, setAllCategories] =
        useState<CashFlowCategoryRead[]>(cashFlowCategories);
    const [isCreatingEntries, setIsCreatingEntries] = useState(false);

    // Consistent date formatting to avoid hydration issues
    const formatDate = useCallback((date: Date) => {
        return date.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }, []);

    // Check if a transaction is already imported as a cash flow entry
    const isTransactionImported = useCallback(
        (transaction: Transaction) => {
            // Safety check for existingCashFlowEntries
            if (
                !existingCashFlowEntries ||
                !Array.isArray(existingCashFlowEntries)
            ) {
                return false;
            }

            return existingCashFlowEntries.some((entry) => {
                // Ensure entry and transaction have valid date properties
                if (
                    !entry ||
                    !entry.date ||
                    !transaction ||
                    !transaction.date
                ) {
                    return false;
                }

                try {
                    // Match by date, amount, description, and extendedDescription
                    const sameDate =
                        entry.date.toDateString() ===
                        transaction.date.toDateString();
                    const sameAmount =
                        Math.abs(entry.amount || 0) ===
                        Math.abs(transaction.amount || 0);
                    const sameDescription =
                        (entry.description || "") ===
                        (transaction.description || "");
                    const sameExtendedDescription =
                        (entry.extendedDescription || "") ===
                        (transaction.extendedDescription || "");

                    return (
                        sameDate &&
                        sameAmount &&
                        sameDescription &&
                        sameExtendedDescription
                    );
                } catch (error) {
                    console.warn(
                        "Error comparing transaction with existing entry:",
                        error,
                    );
                    return false;
                }
            });
        },
        [existingCashFlowEntries],
    );

    // Sync categories when prop changes
    useEffect(() => {
        setAllCategories(cashFlowCategories);
    }, [cashFlowCategories]);

    // Handle new category creation
    const handleCategoryCreate = async (category: {
        name: string;
        type: "income" | "expense";
    }) => {
        if (!onCategoryCreate) {
            throw new Error("Category creation handler not provided");
        }

        const newCategory = await onCategoryCreate(category);
        setAllCategories((prev) => [...prev, newCategory]);
        return newCategory;
    };

    // Handle creating cash flow entries from transactions with categories
    const handleCreateCashFlowEntries = async () => {
        setIsCreatingEntries(true);
        try {
            // Get all transactions with assigned categories, excluding already imported ones
            const categoryAssignments: [number, number][] = [];

            filteredTransactions.forEach((transaction, index) => {
                const categoryId = transactionCategories.get(index);
                const isImported = isTransactionImported(transaction);

                if (categoryId && !isImported) {
                    categoryAssignments.push([index, categoryId]);
                }
            });

            if (categoryAssignments.length === 0) {
                // Check if there are any unassigned categories among non-imported transactions
                const unimportedTransactions = filteredTransactions.filter(
                    (transaction) => !isTransactionImported(transaction),
                );

                if (unimportedTransactions.length === 0) {
                    notifyError("All transactions have already been imported.");
                } else {
                    notifyError(
                        "Please assign categories to at least one non-imported transaction before creating cash flow entries.",
                    );
                }
                return;
            }

            const result = await handledCreateCashFlowEntriesFromTransactions({
                transactions: filteredTransactions,
                categoryAssignments,
            });

            if (
                result &&
                typeof result === "object" &&
                "type" in result &&
                result.type === "__failure__"
            ) {
                throw new Error(result.message);
            }

            notifySuccess(
                `Successfully created ${categoryAssignments.length} cash flow entries!`,
            );

            // Clear category assignments after successful creation
            setTransactionCategories(new Map());

            // Refresh the current route to update the data
            router.refresh();
        } catch (error) {
            console.error("Failed to create cash flow entries:", error);
            notifyError(
                `Failed to create cash flow entries: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        } finally {
            setIsCreatingEntries(false);
        }
    };

    // Filter transactions based on selected filter and search term
    const filteredTransactions = useMemo(() => {
        let filtered = transactions;

        // Apply amount filter
        switch (filter) {
            case "incoming":
                filtered = transactions.filter((t) => t.amount > 0);
                break;
            case "outgoing":
                filtered = transactions.filter((t) => t.amount < 0);
                break;
            default:
                filtered = transactions;
        }

        // Apply search filter
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.description.toLowerCase().includes(search) ||
                    t.extendedDescription.toLowerCase().includes(search),
            );
        }

        // Apply hide imported filter
        if (hideImported) {
            filtered = filtered.filter((t) => !isTransactionImported(t));
        }

        return filtered;
    }, [transactions, filter, searchTerm, hideImported, isTransactionImported]);

    // Calculate balance over time for chart
    const balanceData = useMemo(() => {
        if (transactions.length === 0) return [];

        // Sort transactions by date
        const sortedTransactions = [...transactions].sort(
            (a, b) => a.date.getTime() - b.date.getTime(),
        );

        let runningBalance = 0;
        return sortedTransactions.map((transaction) => {
            runningBalance += transaction.amount;
            return {
                date: formatDate(transaction.date),
                balance: runningBalance,
                amount: transaction.amount,
                description: transaction.description,
            };
        });
    }, [transactions, formatDate]);

    // Selection handlers
    const handleSelectAll = () => {
        if (selectedRows.size === filteredTransactions.length) {
            // If all filtered rows are selected, deselect all
            setSelectedRows(new Set());
            setLastSelectedIndex(null);
        } else {
            // Select all filtered rows
            setSelectedRows(
                new Set(filteredTransactions.map((_, index) => index)),
            );
            setLastSelectedIndex(null);
        }
    };

    const handleRowSelect = (index: number, isShiftClick = false) => {
        const newSelected = new Set(selectedRows);

        if (isShiftClick && lastSelectedIndex !== null) {
            // Range selection with shift-click
            const start = Math.min(lastSelectedIndex, index);
            const end = Math.max(lastSelectedIndex, index);

            // Add all rows in the range to selection
            for (let i = start; i <= end; i++) {
                newSelected.add(i);
            }
        } else {
            // Regular selection toggle
            if (newSelected.has(index)) {
                newSelected.delete(index);
            } else {
                newSelected.add(index);
            }
        }

        setSelectedRows(newSelected);
        setLastSelectedIndex(index);
    };

    const handleRowClick = (index: number, event: React.MouseEvent) => {
        // Prevent selection when clicking on checkbox
        const target = event.target as HTMLElement;
        if (
            target.tagName === "INPUT" &&
            (target as HTMLInputElement).type === "checkbox"
        ) {
            return;
        }

        const isShiftClick = event.shiftKey;
        handleRowSelect(index, isShiftClick);
    };

    // Category assignment handler
    const handleCategoryChange = (
        transactionIndex: number,
        categoryId: number | null,
    ) => {
        setTransactionCategories((prev) => {
            const newMap = new Map(prev);
            if (categoryId === null) {
                newMap.delete(transactionIndex);
            } else {
                newMap.set(transactionIndex, categoryId);
            }
            return newMap;
        });
    };

    // Bulk category assignment handler
    const handleBulkCategoryChange = (categoryId: number | null) => {
        setTransactionCategories((prev) => {
            const newMap = new Map(prev);

            selectedRows.forEach((index) => {
                const transaction = filteredTransactions[index];
                // Only assign to non-imported transactions
                if (!isTransactionImported(transaction)) {
                    if (categoryId === null) {
                        newMap.delete(index);
                    } else {
                        newMap.set(index, categoryId);
                    }
                }
            });

            return newMap;
        });
    };

    const isAllSelected =
        selectedRows.size === filteredTransactions.length &&
        filteredTransactions.length > 0;
    const isIndeterminate =
        selectedRows.size > 0 &&
        selectedRows.size < filteredTransactions.length;

    return (
        <div className="text-sm mt-6">
            {/* Balance Chart */}
            {balanceData.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Balance Over Time
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={balanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) =>
                                        `€${value.toFixed(0)}`
                                    }
                                />
                                <Tooltip
                                    formatter={(
                                        value: number,
                                        name: string,
                                    ) => [
                                        `€${value.toFixed(2)}`,
                                        name === "balance"
                                            ? "Balance"
                                            : "Amount",
                                    ]}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "#2563eb",
                                        strokeWidth: 2,
                                        r: 3,
                                    }}
                                    activeDot={{
                                        r: 5,
                                        stroke: "#2563eb",
                                        strokeWidth: 2,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Filter and Search Controls */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Transactions</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1 rounded text-sm ${
                                filter === "all"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            All ({transactions.length})
                            {hideImported && (
                                <span className="ml-1 text-xs opacity-75">
                                    (
                                    {
                                        transactions.filter(
                                            (t) => !isTransactionImported(t),
                                        ).length
                                    }{" "}
                                    available)
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setFilter("incoming")}
                            className={`px-3 py-1 rounded text-sm ${
                                filter === "incoming"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Incoming (
                            {transactions.filter((t) => t.amount > 0).length})
                            {hideImported && (
                                <span className="ml-1 text-xs opacity-75">
                                    (
                                    {
                                        transactions.filter(
                                            (t) =>
                                                t.amount > 0 &&
                                                !isTransactionImported(t),
                                        ).length
                                    }{" "}
                                    available)
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setFilter("outgoing")}
                            className={`px-3 py-1 rounded text-sm ${
                                filter === "outgoing"
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Outgoing (
                            {transactions.filter((t) => t.amount < 0).length})
                            {hideImported && (
                                <span className="ml-1 text-xs opacity-75">
                                    (
                                    {
                                        transactions.filter(
                                            (t) =>
                                                t.amount < 0 &&
                                                !isTransactionImported(t),
                                        ).length
                                    }{" "}
                                    available)
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Input and Hide Imported Filter */}
                <div className="flex justify-between items-center">
                    <div className="w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search by description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="hideImported"
                            checked={hideImported}
                            onChange={(e) => setHideImported(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                            htmlFor="hideImported"
                            className="text-sm text-gray-700 cursor-pointer select-none"
                        >
                            Hide imported transactions
                        </label>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left border-b w-12">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(input) => {
                                        if (input)
                                            input.indeterminate =
                                                isIndeterminate;
                                    }}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Description
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Extended Description
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Category
                            </th>
                            <th className="px-4 py-2 text-right border-b">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => {
                            const isImported =
                                isTransactionImported(transaction);
                            return (
                                <tr
                                    key={index}
                                    className={`${
                                        isImported
                                            ? "bg-gray-100 cursor-not-allowed opacity-60"
                                            : `hover:bg-gray-50 cursor-pointer ${selectedRows.has(index) ? "bg-blue-50" : ""}`
                                    } select-none`}
                                    onClick={
                                        isImported
                                            ? undefined
                                            : (event) =>
                                                  handleRowClick(index, event)
                                    }
                                >
                                    <td className="px-4 py-2 border-b w-12">
                                        <input
                                            type="checkbox"
                                            checked={
                                                !isImported &&
                                                selectedRows.has(index)
                                            }
                                            disabled={isImported}
                                            onChange={(e) => {
                                                e.stopPropagation(); // Prevent row click
                                                if (!isImported) {
                                                    handleRowSelect(index);
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {transaction.description}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {transaction.extendedDescription}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {isImported ? (
                                            <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                                                Already imported
                                            </span>
                                        ) : (
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <CategorySelector
                                                    categories={allCategories}
                                                    selectedCategoryId={
                                                        transactionCategories.get(
                                                            index,
                                                        ) || null
                                                    }
                                                    transactionType={
                                                        transaction.amount >= 0
                                                            ? "income"
                                                            : "expense"
                                                    }
                                                    onCategorySelect={(
                                                        categoryId,
                                                    ) =>
                                                        handleCategoryChange(
                                                            index,
                                                            categoryId,
                                                        )
                                                    }
                                                    onCategoryCreate={
                                                        handleCategoryCreate
                                                    }
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td
                                        className={`px-4 py-2 border-b text-right font-medium ${
                                            transaction.amount >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        €{transaction.amount.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-sm text-gray-600 flex justify-between">
                <div className="flex gap-4">
                    <span>
                        Showing {filteredTransactions.length} of{" "}
                        {transactions.length} transactions
                    </span>
                    {(() => {
                        const importedCount = filteredTransactions.filter(
                            (transaction) => isTransactionImported(transaction),
                        ).length;
                        const availableCount =
                            filteredTransactions.length - importedCount;

                        if (
                            importedCount > 0 ||
                            availableCount < filteredTransactions.length
                        ) {
                            return (
                                <span className="text-orange-600">
                                    {importedCount} imported, {availableCount}{" "}
                                    available
                                </span>
                            );
                        }
                        return null;
                    })()}
                    {selectedRows.size > 0 && (
                        <span className="text-blue-600 font-medium">
                            {selectedRows.size} selected
                        </span>
                    )}
                </div>
                {(filter !== "all" || searchTerm.trim() || hideImported) && (
                    <span className="text-blue-600">
                        {filter !== "all" &&
                            `Filter: ${filter === "incoming" ? "Incoming only" : "Outgoing only"}`}
                        {filter !== "all" &&
                            (searchTerm.trim() || hideImported) &&
                            " | "}
                        {searchTerm.trim() && `Search: "${searchTerm}"`}
                        {searchTerm.trim() && hideImported && " | "}
                        {hideImported && "Hiding imported"}
                    </span>
                )}
            </div>

            {/* Bulk Actions for Selected Rows */}
            {selectedRows.size > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-blue-800">
                                {selectedRows.size} transaction(s) selected
                            </span>
                            <div className="text-sm text-blue-600">
                                {(() => {
                                    const selectedNonImported = Array.from(
                                        selectedRows,
                                    ).filter(
                                        (index) =>
                                            !isTransactionImported(
                                                filteredTransactions[index],
                                            ),
                                    ).length;
                                    const selectedImported =
                                        selectedRows.size - selectedNonImported;

                                    if (selectedImported > 0) {
                                        return `${selectedNonImported} available, ${selectedImported} already imported`;
                                    }
                                    return `${selectedNonImported} available for categorization`;
                                })()}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-blue-800">
                                Assign category to selected:
                            </span>
                            <div className="min-w-48">
                                <CategorySelector
                                    categories={allCategories}
                                    selectedCategoryId={null}
                                    transactionType={(() => {
                                        // Determine transaction type based on selected transactions
                                        const selectedTransactions = Array.from(
                                            selectedRows,
                                        )
                                            .map(
                                                (index) =>
                                                    filteredTransactions[index],
                                            )
                                            .filter(
                                                (t) =>
                                                    !isTransactionImported(t),
                                            );

                                        const hasIncome =
                                            selectedTransactions.some(
                                                (t) => t.amount >= 0,
                                            );
                                        const hasExpense =
                                            selectedTransactions.some(
                                                (t) => t.amount < 0,
                                            );

                                        // If mixed types, default to expense; if all same type, use that type
                                        if (hasIncome && hasExpense)
                                            return "expense";
                                        if (hasIncome) return "income";
                                        return "expense";
                                    })()}
                                    onCategorySelect={handleBulkCategoryChange}
                                    onCategoryCreate={handleCategoryCreate}
                                    className="h-8 text-xs"
                                    placeholder="Select category for all..."
                                />
                            </div>
                            <Button
                                onClick={() => setSelectedRows(new Set())}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                            >
                                Clear selection
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Selection Actions */}
            {filteredTransactions.length > 0 && selectedRows.size === 0 && (
                <div className="mt-4 flex gap-2">
                    <Button
                        onClick={() => {
                            const nonImportedIndices = filteredTransactions
                                .map((transaction, index) => ({
                                    transaction,
                                    index,
                                }))
                                .filter(
                                    ({ transaction }) =>
                                        !isTransactionImported(transaction),
                                )
                                .map(({ index }) => index);
                            setSelectedRows(new Set(nonImportedIndices));
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                    >
                        Select all available transactions
                    </Button>
                </div>
            )}

            {/* Create Cash Flow Entries Button */}
            <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {(() => {
                            const categorizedCount = Array.from(
                                transactionCategories.entries(),
                            ).filter(([index, categoryId]) => {
                                const transaction = filteredTransactions[index];
                                return (
                                    categoryId &&
                                    !isTransactionImported(transaction)
                                );
                            }).length;

                            return `${categorizedCount} non-imported transaction(s) with assigned categories`;
                        })()}
                    </div>
                    <Button
                        onClick={handleCreateCashFlowEntries}
                        disabled={
                            isCreatingEntries ||
                            Array.from(transactionCategories.entries()).filter(
                                ([index, categoryId]) => {
                                    const transaction =
                                        filteredTransactions[index];
                                    return (
                                        categoryId &&
                                        !isTransactionImported(transaction)
                                    );
                                },
                            ).length === 0
                        }
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isCreatingEntries
                            ? "Creating..."
                            : "Create Cash Flow Entries"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
