"use client";

import { useState, useCallback } from "react";
import { cashFlowService } from "../cash-flow.service";
import BankTransactionsTable from "./bank-transactions-table";
import {
  handledCreateCashFlowCategory,
  handledGetAllCashFlowCategory,
} from "../cash-flow-categories.actions";
import { CashFlowCategoryRead } from "../schemas/cash-flow-category-read";
import { CashFlowEntryRead } from "../schemas/cash-flow-entry-read";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError } from "@/modules/ui/components/notify";

interface CashFlowImportPreviewProps {
  id: string;
  initialCashFlowImport: Awaited<
    ReturnType<typeof cashFlowService.getCashFlowImportExtended>
  >;
  initialCashFlowCategories: CashFlowCategoryRead[];
  initialBankStatement: Awaited<
    ReturnType<typeof cashFlowService.parseBankStatementXlsx>
  >;
  existingCashFlowEntries: CashFlowEntryRead[];
}

// Client component for previewing a cash flow import by id
export default function CashFlowImportPreview({
  id,
  initialCashFlowImport,
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
            cat.name === category.name && cat.type === category.type
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
    []
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
      <h2 className="text-2xl font-bold mb-4">Cash Flow Import Preview</h2>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Bank Statement Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Account Number</div>
            <div className="font-medium">{bankStatement.accountNumber}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Opening Balance</div>
            <div className="font-medium">
              €{bankStatement.openingBalance.amount.toFixed(2)}
              <div className="text-xs text-gray-500">
                {formatDate(bankStatement.openingBalance.date)}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Closing Balance</div>
            <div className="font-medium">
              €{bankStatement.closingBalance.amount.toFixed(2)}
              <div className="text-xs text-gray-500">
                {formatDate(bankStatement.closingBalance.date)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BankTransactionsTable
        cashFlowCategories={cashFlowCategories}
        transactions={bankStatement.transactions}
        existingCashFlowEntries={existingCashFlowEntries}
        onCategoryCreate={handleCategoryCreate}
      />
    </div>
  );
}
