import { suppliersServer } from "@/modules/suppliers/suppliers.server";
import { Title } from "@/modules/ui/components/title";
import { SupplierCard } from "./supplier-card";

export async function SupplierList() {
    const suppliers = await suppliersServer.allExtended();
    return (
        <div>
            <Title>{`Supplier(${suppliers.length})`}</Title>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {suppliers.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
            </div>
        </div>
    );
}
