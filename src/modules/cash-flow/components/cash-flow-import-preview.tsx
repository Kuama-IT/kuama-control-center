import React from "react";
import { cashFlowService } from "../cash-flow.service";
import BankTransactionsTable from "./bank-transactions-table";

interface CashFlowImportPreviewProps {
  id: string;
}

// Server component for previewing a cash flow import by id
export default async function CashFlowImportPreview({
  id,
}: CashFlowImportPreviewProps) {
  const cashFlowImport = await cashFlowService.getCashFlowImportExtended(
    parseInt(id)
  );

  // Parse the Excel file to get bank statement data
  const fileBuffer = Buffer.from(cashFlowImport.fileBase64, "base64");
  const bankStatement =
    await cashFlowService.parseBankStatementXlsx(fileBuffer);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cash Flow Import Preview</h2>
      <div className="space-y-4">
        <div>
          <strong>ID:</strong> {cashFlowImport.id}
        </div>
        <div>
          <strong>File Name:</strong> {cashFlowImport.fileName}
        </div>
        <div>
          <strong>File Size:</strong> {cashFlowImport.fileSizeInKB} KB
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(cashFlowImport.createdAt).toLocaleString()}
        </div>
        {cashFlowImport.importedAt && (
          <div>
            <strong>Imported At:</strong>{" "}
            {new Date(cashFlowImport.importedAt).toLocaleString()}
          </div>
        )}
      </div>

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
                {bankStatement.openingBalance.date.toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Closing Balance</div>
            <div className="font-medium">
              €{bankStatement.closingBalance.amount.toFixed(2)}
              <div className="text-xs text-gray-500">
                {bankStatement.closingBalance.date.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BankTransactionsTable transactions={bankStatement.transactions} />
    </div>
  );
}
