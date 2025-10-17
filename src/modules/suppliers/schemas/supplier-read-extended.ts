import { type VatReadDto } from "@/modules/invoices/schemas/vat.read";
import { type SupplierRead } from "@/modules/suppliers/schemas/supplier.read";

export type SupplierReadExtended = SupplierRead & {
    vat?: VatReadDto;
};
