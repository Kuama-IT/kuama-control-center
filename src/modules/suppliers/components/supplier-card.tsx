"use client";
import { type SupplierReadExtended } from "@/modules/suppliers/schemas/supplier-read-extended";
import { BrutalCard } from "@/modules/ui";

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
                <p>{`Email: ${supplier.email}`}</p>
                <p>{`Phone: ${supplier.phone}`}</p>
                <p>{`VAT / TAX CODE: ${supplier.vat.vat}`}</p>
            </BrutalCard>
        </div>
    );
}
