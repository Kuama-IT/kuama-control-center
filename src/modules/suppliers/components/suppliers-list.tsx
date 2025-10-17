import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { suppliersServer } from "@/modules/suppliers/suppliers.server";
import { brutalTheme } from "@/modules/ui";
import { Title } from "@/modules/ui/components/title";
import { SupplierCard } from "./supplier-card";

export async function SupplierList() {
    const suppliers = await suppliersServer.allExtended();
    return (
        <div>
            <div className="flex items-center justify-between">
                <Title>{`Suppliers (${suppliers.length})`}</Title>
                <Link
                    href="/suppliers/settings"
                    className={brutalTheme.typography.caption}
                >
                    <SettingsIcon />
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {suppliers.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
            </div>
        </div>
    );
}
