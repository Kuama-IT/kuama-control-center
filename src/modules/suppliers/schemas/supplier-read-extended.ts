import { type VatReadDto } from "@/modules/invoices/schemas/vat.read";
import { type SupplierReadDto } from "@/modules/suppliers/schemas/supplier.read";
import { type SupplierInvoicedTotalDto } from "@/modules/suppliers/schemas/supplier-invoiced-total.schemas";

export type SupplierReadExtended = SupplierReadDto & {
    vat?: VatReadDto;
    totalInvoiced: SupplierInvoicedTotalDto;
};
