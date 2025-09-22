"use client";

import React from "react";
import { Transaction } from "../schemas/bank-statement-read";

interface BankTransactionsTableProps {
  transactions: Transaction[];
}

export default function BankTransactionsTable({
  transactions,
}: BankTransactionsTableProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left border-b">Date</th>
              <th className="px-4 py-2 text-left border-b">Description</th>
              <th className="px-4 py-2 text-left border-b">
                Extended Description
              </th>
              <th className="px-4 py-2 text-right border-b">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  {transaction.date.toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  {transaction.description}
                </td>
                <td className="px-4 py-2 border-b">
                  {transaction.extendedDescription}
                </td>
                <td
                  className={`px-4 py-2 border-b text-right font-medium ${
                    transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  €{transaction.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total transactions: {transactions.length}
      </div>
    </div>
  );
}
