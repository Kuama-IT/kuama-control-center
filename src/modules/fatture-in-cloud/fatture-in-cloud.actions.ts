import { and, desc, gte, lte } from "drizzle-orm";
import { db } from "@/drizzle/drizzle-db";
import { invoices } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { fattureInCloudApiClient } from "./fatture-in-cloud-api";

export const handledFattureInCloudClientsAll = handleServerErrors(
    async function () {
        return await fattureInCloudApiClient.getClients();
    },
);

export const handledFattureInCloudSuppliersAll = handleServerErrors(
    async function () {
        return await fattureInCloudApiClient.getSuppliers();
    },
);

export const handledGetFattureInCloudEmittedInvoicesGraphData =
    handleServerErrors(async function () {
        const now = new Date();
        const startDate = new Date(now.getFullYear() - 1, 0, 1); // Jan 1st of previous year
        const endDate = new Date(now.getFullYear(), 11, 31); // Dec 31st of current year

        // drizzle expects date strings in YYYY-MM-DD format
        const startDateStr = startDate.toISOString().slice(0, 10);
        const endDateStr = endDate.toISOString().slice(0, 10);

        // fetch invoices for the last two years (by date)
        const invoicesResult = await db
            .select()
            .from(invoices)
            .where(
                and(
                    gte(invoices.date, startDateStr),
                    lte(invoices.date, endDateStr),
                ),
            )
            .orderBy(desc(invoices.date));

        // aggregate by month
        const dataMap: Record<
            string,
            { month: string; currentYear: number; previousYear: number }
        > = {};
        for (const invoice of invoicesResult) {
            if (!invoice.date) {
                continue;
            }
            const date = new Date(invoice.date);
            const monthKey = `${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!dataMap[monthKey]) {
                dataMap[monthKey] = {
                    month: monthKey,
                    currentYear: date.getFullYear(),
                    previousYear: date.getFullYear() - 1,
                };
            }

            if (date.getFullYear() === now.getFullYear()) {
                dataMap[monthKey].currentYear += invoice.amountNet ?? 0;
            } else {
                dataMap[monthKey].previousYear += invoice.amountNet ?? 0;
            }
        }

        // convert to array and sort by month
        const result = Object.values(dataMap).sort((a, b) =>
            a.month.localeCompare(b.month),
        );

        // fix amounts to 2 decimals
        result.forEach((it) => {
            it.currentYear = parseFloat(it.currentYear.toFixed(2));
            it.previousYear = parseFloat(it.previousYear.toFixed(2));
        });

        return result;
    });

export type InvoicesGraphData = {
    month: string;
    currentYear: number;
    previousYear: number;
}[];
