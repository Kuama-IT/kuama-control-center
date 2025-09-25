"use client";
import { Supplier } from "@fattureincloud/fattureincloud-ts-sdk";

export function FattureInCloudSupplierCard({
  supplier,
  selected = false,
  onClick,
}: {
  supplier: Supplier;
  selected?: boolean;
  onClick?: (supplier: Supplier) => void;
}) {
  return (
    <div
      className={`border p-4 rounded mb-2 ${selected ? "bg-blue-100" : ""}`}
      onClick={() => onClick?.(supplier)}
    >
      <h3 className="text-lg font-bold">{supplier.name}</h3>
      <p>Email: {supplier.email}</p>
      <p>Phone: {supplier.phone}</p>
      <p>VAT/TAX CODE: {supplier.vat_number ?? supplier.tax_code}</p>
    </div>
  );
}
