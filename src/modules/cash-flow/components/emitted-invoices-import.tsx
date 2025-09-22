"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmittedInvoicesList } from "./emitted-invoices-list";

const queryClient = new QueryClient();

export function EmittedInvoicesImport({ from, to }: { from: Date; to: Date }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EmittedInvoicesList from={from} to={to} />
    </QueryClientProvider>
  );
}
