"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { cashFlowService } from "./cash-flow.service";
import { type Transaction } from "./schemas/bank-statement-read";

export const handledDeleteCashFlowImport = handleServerErrors(
    async (id: number) => {
        await cashFlowService.deleteCashFlowImport(id);
    },
);

export const handledCreateCashFlowEntriesFromTransactions = handleServerErrors(
    async (data: {
        transactions: Transaction[];
        categoryAssignments: [number, number][]; // [transactionIndex, categoryId]
    }) => {
        const categoryMap = new Map(data.categoryAssignments);
        return await cashFlowService.createCashFlowEntriesFromTransactions(
            data.transactions,
            categoryMap,
        );
    },
);

export const getCashFlowGraphData = handleServerErrors(
    async ({ from, to }: { from: Date; to: Date }) => {
        // this function should return data for graphing a graph that lets us understand
        // - how many money can be spent next month based on past income and expenses
        // - it should consider also invoices due in the next month (both incoming and outgoing)
    },
);
