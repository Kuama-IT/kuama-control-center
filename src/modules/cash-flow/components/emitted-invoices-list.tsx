"use client";

import { format } from "date-fns";
import {
    Building2,
    Calculator,
    Calendar as CalendarIcon,
    Clock,
    Euro,
    FileText,
    Hash,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Separator } from "@/components/ui/separator";
import { useEmittedInvoicesQuery } from "@/modules/fatture-in-cloud/queries/fatture-in-cloud.queries";
import { useCreateInvoicesByFattureInCloudDtosMutation } from "@/modules/invoices/mutations/invoices.mutations";

export function EmittedInvoicesList({ from, to }: { from: Date; to: Date }) {
    const [selectedFrom, setSelectedFrom] = useState<Date>(from);
    const [selectedTo, setSelectedTo] = useState<Date>(to);

    const query = useEmittedInvoicesQuery({
        from: selectedFrom,
        to: selectedTo,
    });

    const createInvoicesMutation =
        useCreateInvoicesByFattureInCloudDtosMutation();
    if (query.isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">
                    {"Loading emitted invoices..."}
                </div>
            </div>
        );
    }

    if (query.isError) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-destructive">
                    {`Error loading emitted invoices: ${String(query.error)}`}
                </div>
            </div>
        );
    }

    if (!query.data || query.data.length === 0) {
        return (
            <div className="space-y-6 p-8">
                <DateRangePicker
                    from={selectedFrom}
                    to={selectedTo}
                    onFromChange={setSelectedFrom}
                    onToChange={setSelectedTo}
                    title="Emitted Invoices"
                    statusText="0 invoices found"
                />
                <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground">
                        {"No invoices found for this period."}
                    </div>
                </div>
            </div>
        );
    }

    // Calculate totals
    const totals = query.data.reduce(
        (acc, invoice) => {
            acc.count += 1;
            acc.totalNet += invoice.amount_net || 0;
            acc.totalVat += invoice.amount_vat || 0;
            acc.totalGross += invoice.amount_gross || 0;
            return acc;
        },
        { count: 0, totalNet: 0, totalVat: 0, totalGross: 0 },
    );

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-4">
                <DateRangePicker
                    from={selectedFrom}
                    to={selectedTo}
                    onFromChange={setSelectedFrom}
                    onToChange={setSelectedTo}
                    title="Emitted Invoices"
                    statusText={
                        query.isLoading
                            ? "Loading..."
                            : `${query.data?.length || 0} invoices found`
                    }
                />

                <Button
                    onClick={() => createInvoicesMutation.mutate(query.data)}
                    disabled={createInvoicesMutation.isPending}
                >
                    {createInvoicesMutation.isPending
                        ? "Creating..."
                        : "Create Invoices"}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <p className="font-medium text-muted-foreground text-sm">
                            {"Total Invoices"}
                        </p>
                    </div>
                    <p className="font-bold text-2xl">{totals.count}</p>
                </div>

                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-green-500" />
                        <p className="font-medium text-muted-foreground text-sm">
                            {"Total Net"}
                        </p>
                    </div>
                    <p className="font-bold text-2xl text-green-600">
                        {`€${totals.totalNet.toFixed(2)}`}
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <Euro className="h-5 w-5 text-orange-500" />
                        <p className="font-medium text-muted-foreground text-sm">
                            {"Total VAT"}
                        </p>
                    </div>
                    <p className="font-bold text-2xl text-orange-600">
                        {`€${totals.totalVat.toFixed(2)}`}
                    </p>
                </div>

                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        <p className="font-medium text-muted-foreground text-sm">
                            {"Total Gross"}
                        </p>
                    </div>
                    <p className="font-bold text-2xl text-purple-600">
                        {`{€${totals.totalGross.toFixed(2)}}`}
                    </p>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                {query.data.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-lg">
                                        {invoice.entity?.name ||
                                            "Unknown Client"}
                                    </h3>
                                </div>
                                {invoice.entity?.vat_number && (
                                    <p className="text-muted-foreground text-sm">
                                        {`VAT: ${invoice.entity.vat_number}`}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="mb-1 flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <Badge
                                        variant="outline"
                                        className="font-mono"
                                    >
                                        {invoice.number || "N/A"}
                                    </Badge>
                                </div>
                                {invoice.date && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <CalendarIcon className="h-4 w-4" />
                                        {format(
                                            new Date(invoice.date),
                                            "dd/MM/yyyy",
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div
                            className={`mb-4 grid grid-cols-1 gap-4 ${
                                invoice.amount_vat !== null &&
                                invoice.amount_vat !== undefined
                                    ? "md:grid-cols-3"
                                    : "md:grid-cols-2"
                            }`}
                        >
                            <div className="space-y-1">
                                <p className="font-medium text-muted-foreground text-sm">
                                    {"Net Amount"}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Euro className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-semibold">
                                        {invoice.amount_net !== null &&
                                        invoice.amount_net !== undefined
                                            ? `€${invoice.amount_net.toFixed(2)}`
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                            {invoice.amount_vat !== null &&
                                invoice.amount_vat !== undefined && (
                                    <div className="space-y-1">
                                        <p className="font-medium text-muted-foreground text-sm">
                                            {"VAT Amount"}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Euro className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-semibold">
                                                {`€${invoice.amount_vat.toFixed(2)}`}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            <div className="space-y-1">
                                <p className="font-medium text-muted-foreground text-sm">
                                    {"Total Amount"}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Euro className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-bold text-lg">
                                        {invoice.amount_gross !== null &&
                                        invoice.amount_gross !== undefined
                                            ? `€${invoice.amount_gross.toFixed(2)}`
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {invoice.payments_list?.[0]?.due_date && (
                            <>
                                <Separator className="my-4" />
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    <span className="text-muted-foreground">
                                        {"Due date:"}
                                    </span>
                                    <Badge variant="secondary">
                                        {format(
                                            new Date(
                                                invoice.payments_list[0]
                                                    .due_date,
                                            ),
                                            "dd/MM/yyyy",
                                        )}
                                    </Badge>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
