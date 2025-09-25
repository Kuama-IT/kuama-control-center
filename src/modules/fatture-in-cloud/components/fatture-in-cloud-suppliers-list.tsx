import { Supplier } from "@fattureincloud/fattureincloud-ts-sdk";
import { FattureInCloudSupplierCard } from "./fatture-in-cloud-supplier-card";

export function FattureInCloudSupplierList({
  suppliers,
}: {
  suppliers: Supplier[];
}) {
  return (
    <div>
      <h2 className="bold uppercase py-2 border-b-blue-200 mb-4 border-b-2">
        Supplier List ({suppliers.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suppliers.map((supplier) => (
          <FattureInCloudSupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
