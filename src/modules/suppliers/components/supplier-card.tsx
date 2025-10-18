"use client";
import { type SupplierReadExtended } from "@/modules/suppliers/schemas/supplier-read-extended";
import { BrutalCard } from "@/modules/ui";
import { brutalTheme } from "@/modules/ui/brutal-theme";

export function SupplierCard({
    supplier,
    onClick,
}: {
    supplier: SupplierReadExtended;
    onClick?: () => void;
}) {
    return (
        <div onClick={() => onClick?.()}>
            <BrutalCard>
                <h3 className="font-bold text-lg">{supplier.name}</h3>
                <p>{`VAT / TAX CODE: ${supplier.vat?.vat ?? "N/A"}`}</p>
                <SupplierTotals
                    net={supplier.totalInvoiced.net ?? 0}
                    gross={supplier.totalInvoiced.gross ?? 0}
                    vat={supplier.totalInvoiced.vat ?? 0}
                />
            </BrutalCard>
        </div>
    );
}

export function SupplierTotals({
    net,
    gross,
    vat,
}: {
    net: number;
    gross: number;
    vat: number;
}) {
    return (
        <div className="flex justify-between gap-4">
            <Stat
                label="Netto"
                value={net.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "EUR",
                })}
            />
            <Stat
                label="IVA"
                value={vat.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "EUR",
                })}
            />
            <Stat
                label="Lordo"
                value={gross.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "EUR",
                })}
            />
        </div>
    );
}

type StatProps = {
    label: string;
    value: string | number;
    color?: string;
    className?: string;
};

export function Stat({ label, value, color, className }: StatProps) {
    return (
        <div
            className={`flex min-w-[100px] flex-col items-center justify-center rounded-lg border-4 px-4 py-2 font-bold ${className ?? ""}`}
            style={{
                borderColor: color ?? brutalTheme.colors.primary.black,
            }}
        >
            <span className="mb-1 text-xs uppercase tracking-wide">
                {label}
            </span>
            <span className="font-bold text-lg">{value}</span>
        </div>
    );
}
