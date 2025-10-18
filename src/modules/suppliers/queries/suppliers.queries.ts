import { useQuery } from "@tanstack/react-query";
import {
    type SupplierInvoicedTotalRequestDto,
    supplierInvoicedTotalSchema,
} from "@/modules/suppliers/schemas/supplier-invoiced-total.schemas";

export const useGetSupplierInvoicedTotal = ({
    year,
    id,
}: SupplierInvoicedTotalRequestDto) => {
    return useQuery({
        queryKey: ["suppliers", id, year],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (year) params.append("year", year.toString());
            const res = await fetch(
                `/api/suppliers/${id}?${params.toString()}`,
            );

            const json = await res.json();

            return supplierInvoicedTotalSchema.parse(json);
        },
    });
};
