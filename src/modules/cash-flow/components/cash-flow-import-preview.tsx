"use client";

import { useCallback, useState } from "react";
import { notifyError } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/server-action-utils";
import { type cashFlowService } from "../cash-flow.service";
import {
    handledCreateCashFlowCategory,
    handledGetAllCashFlowCategory,
} from "../cash-flow-categories.actions";
import { type CashFlowCategoryRead } from "../schemas/cash-flow-category-read";
import { type CashFlowEntryRead } from "../schemas/cash-flow-entry-read";
import BankTransactionsTable from "./bank-transactions-table";

type CashFlowImportPreviewProps = {
    id: number;
    initialCashFlowImport: Awaited<
        ReturnType<typeof cashFlowService.getCashFlowImportExtended>
    >;
    initialCashFlowCategories: CashFlowCategoryRead[];
    initialBankStatement: Awaited<
        ReturnType<typeof cashFlowService.parseBankStatementXlsx>
    >;
    existingCashFlowEntries: CashFlowEntryRead[];
};

// Client component for previewing a cash flow import by id
export default function CashFlowImportPreview({
    id,
    initialCashFlowCategories,
    initialBankStatement,
    existingCashFlowEntries,
}: CashFlowImportPreviewProps) {
    const [cashFlowCategories, setCashFlowCategories] = useState<
        CashFlowCategoryRead[]
    >(initialCashFlowCategories);

    const handleCategoryCreate = useCallback(
        async (category: { name: string; type: "income" | "expense" }) => {
            try {
                // Create the category using server action
                const createResult = await handledCreateCashFlowCategory({
                    name: category.name,
                    type: category.type,
                });

                if (isFailure(createResult)) {
                    notifyError(createResult.message);
                    throw new Error(createResult.message);
                }

                // Refresh categories list
                const categoriesResult = await handledGetAllCashFlowCategory();

                if (isFailure(categoriesResult)) {
                    notifyError(categoriesResult.message);
                    throw new Error(categoriesResult.message);
                }

                setCashFlowCategories(categoriesResult);

                // Find and return the newly created category
                const newCategory = categoriesResult.find(
                    (cat: CashFlowCategoryRead) =>
                        cat.name === category.name &&
                        cat.type === category.type,
                );

                if (!newCategory) {
                    throw new Error("Failed to find created category");
                }

                return newCategory;
            } catch (error) {
                console.error("Failed to create category:", error);
                throw error;
            }
        },
        [],
    );

    // Consistent date formatting to avoid hydration issues
    const formatDate = useCallback((date: Date) => {
        return date.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }, []);

    const bankStatement = initialBankStatement;

    return (
        <div className="p-6">
            <h2 className="mb-4 font-bold text-2xl">
                {"Cash Flow Import Preview"}
            </h2>

            <div className="mt-8">
                <h3 className="mb-4 font-semibold text-xl">
                    {"Bank Statement Summary"}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-gray-600 text-sm">
                            {"Account Number"}
                        </div>
                        <div className="font-medium">
                            {bankStatement.accountNumber}
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-gray-600 text-sm">
                            {"Opening Balance"}
                        </div>
                        <div className="font-medium">
                            {`€${bankStatement.openingBalance.amount.toFixed(2)}`}
                            <div className="text-gray-500 text-xs">
                                {formatDate(bankStatement.openingBalance.date)}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-gray-600 text-sm">
                            {"Closing Balance"}
                        </div>
                        <div className="font-medium">
                            {`€${bankStatement.closingBalance.amount.toFixed(2)}`}
                            <div className="text-gray-500 text-xs">
                                {formatDate(bankStatement.closingBalance.date)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BankTransactionsTable
                cashFlowImportId={id}
                cashFlowCategories={cashFlowCategories}
                transactions={bankStatement.transactions}
                existingCashFlowEntries={existingCashFlowEntries}
                onCategoryCreate={handleCategoryCreate}
            />
        </div>
    );
}
