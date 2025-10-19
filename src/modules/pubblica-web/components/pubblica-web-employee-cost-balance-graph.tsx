"use client";
import {
    type NameType,
    type Payload,
    type ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { type TooltipContentProps } from "recharts/types/component/Tooltip";

const plottedKeys = [
    "currentYearBusinessCost",
    "previousYearBusinessCost",
    "currentYearInvoices",
    "previousYearInvoices",
];

type PlottableEntry = Payload<ValueType, NameType> & { dataKey: string };

function isPlottableEntry(entry: unknown): entry is PlottableEntry {
    if (!entry || typeof entry !== "object") return false;

    const candidate = entry as Payload<ValueType, NameType>;
    return (
        typeof candidate.dataKey === "string" &&
        plottedKeys.includes(candidate.dataKey)
    );
}

function CustomTooltip({
    active,
    payload,
    label,
}: TooltipContentProps<ValueType, NameType>) {
    if (!(active && payload) || payload.length === 0) return null;

    const filteredPayload = payload.filter(isPlottableEntry);

    if (filteredPayload.length === 0) return null;
    return (
        <div
            style={{
                background: "white",
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: 6,
            }}
        >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
            {filteredPayload.map((entry) => (
                <div
                    key={entry.dataKey}
                    style={{ color: entry.color, marginBottom: 2 }}
                >
                    {entry.name}: <b>{entry.value}</b>
                </div>
            ))}
        </div>
    );
}

import { useId } from "react";
import {
    Area,
    AreaChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { type InvoicesGraphData } from "@/modules/fatture-in-cloud/fatture-in-cloud.actions";
import { type EmployeeCostBalanceGraphData } from "../actions/payrolls.actions";

export function PubblicaWebEmployeeCostBalanceGraph({
    data,
    invoicesData,
}: {
    data: EmployeeCostBalanceGraphData;
    invoicesData: InvoicesGraphData;
}) {
    // Merge employee cost and invoices data by month (using month as key)
    const monthNamesIt = [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
    ];

    const mergedData = data.map((item) => {
        const invoice = Array.isArray(invoicesData)
            ? invoicesData.find((inv) => inv.month === item.month)
            : undefined;
        // Convert month number string (e.g., '01') to Italian month name
        const monthIdx = parseInt(item.month, 10) - 1;
        const monthName = monthNamesIt[monthIdx] || item.month;
        return {
            ...item,
            month: monthName,
            currentYearInvoices: invoice?.currentYear ?? null,
            previousYearInvoices: invoice?.previousYear ?? null,
        };
    });

    const colorPreviousYearInvoicesId = useId();
    const colorCurrentYearInvoicesId = useId();
    const colorPreviousYearBusinessCostId = useId();
    const colorCurrentYearBusinessCostId = useId();

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h3>Employee Cost Balance: Current Year vs Previous Year</h3>
            <ResponsiveContainer>
                <AreaChart
                    data={mergedData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <defs>
                        <linearGradient
                            id={colorCurrentYearBusinessCostId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#2563eb"
                                stopOpacity={0.5}
                            />
                            <stop
                                offset="95%"
                                stopColor="#2563eb"
                                stopOpacity={0.05}
                            />
                        </linearGradient>
                        <linearGradient
                            id={colorPreviousYearBusinessCostId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#a5b4fc"
                                stopOpacity={0.5}
                            />
                            <stop
                                offset="95%"
                                stopColor="#a5b4fc"
                                stopOpacity={0.05}
                            />
                        </linearGradient>
                        <linearGradient
                            id={colorCurrentYearInvoicesId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#059669"
                                stopOpacity={0.5}
                            />
                            <stop
                                offset="95%"
                                stopColor="#059669"
                                stopOpacity={0.05}
                            />
                        </linearGradient>
                        <linearGradient
                            id={colorPreviousYearInvoicesId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#fbbf24"
                                stopOpacity={0.5}
                            />
                            <stop
                                offset="95%"
                                stopColor="#fbbf24"
                                stopOpacity={0.05}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        content={(tooltipProps) => (
                            <CustomTooltip {...tooltipProps} />
                        )}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="currentYearBusinessCost"
                        name="Current Year Business Cost"
                        stroke="#2563eb"
                        fill={`url(#${colorCurrentYearBusinessCostId})`}
                        fillOpacity={1}
                    />
                    <Area
                        type="monotone"
                        dataKey="previousYearBusinessCost"
                        name="Previous Year Business Cost"
                        stroke="#a5b4fc"
                        fill={`url(#${colorPreviousYearBusinessCostId})`}
                        fillOpacity={1}
                    />
                    <Area
                        type="monotone"
                        dataKey="currentYearInvoices"
                        name="Current Year Invoices"
                        stroke="#059669"
                        fill={`url(#${colorCurrentYearInvoicesId})`}
                        fillOpacity={1}
                    />
                    <Area
                        type="monotone"
                        dataKey="previousYearInvoices"
                        name="Previous Year Invoices"
                        stroke="#fbbf24"
                        fill={`url(#${colorPreviousYearInvoicesId})`}
                        fillOpacity={1}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
