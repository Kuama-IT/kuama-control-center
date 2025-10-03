import React from "react";
import { cashFlowService } from "../cash-flow.service";
import { cashFlowCategoryServer } from "../cash-flow-category.server";
import CashFlowImportPreview from "./cash-flow-import-preview";

interface CashFlowImportPreviewServerProps {
  id: string;
}

// Server component wrapper that fetches initial data
export default async function CashFlowImportPreviewServer({
  id,
}: CashFlowImportPreviewServerProps) {
  const cashFlowImport = await cashFlowService.getCashFlowImportExtended(
    parseInt(id)
  );

  const cashFlowCategories = await cashFlowCategoryServer.list();

  // Parse the Excel file to get bank statement data
  const fileBuffer = Buffer.from(cashFlowImport.fileBase64, "base64");
  const bankStatement =
    await cashFlowService.parseBankStatementXlsx(fileBuffer);

  // Get existing cash flow entries for the same period
  const transactions = bankStatement.transactions;
  const startDate = new Date(Math.min(...transactions.map(t => t.date.getTime())));
  const endDate = new Date(Math.max(...transactions.map(t => t.date.getTime())));
  
  const existingCashFlowEntries = await cashFlowService.getCashFlowEntriesByDateRange(
    startDate, 
    endDate
  );

  return (
    <CashFlowImportPreview
      id={id}
      initialCashFlowImport={cashFlowImport}
      initialCashFlowCategories={cashFlowCategories}
      initialBankStatement={bankStatement}
      existingCashFlowEntries={existingCashFlowEntries}
    />
  );
}