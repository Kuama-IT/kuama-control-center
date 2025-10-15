"use client";
import { EmittedInvoicesList } from "./emitted-invoices-list";

export function EmittedInvoicesImport({ from, to }: { from: Date; to: Date }) {
    return <EmittedInvoicesList from={from} to={to} />;
}
