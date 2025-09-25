import { Supplier } from "@fattureincloud/fattureincloud-ts-sdk";
import { FattureInCloudSupplierCard } from "./fatture-in-cloud-supplier-card";

export function FattureInCloudSupplierList({
  suppliers,
}: {
  suppliers: Supplier[];
}) {
  return (
    <div>
      <h2>Supplier List</h2>
      <div>
        {suppliers.map((supplier) => (
          <FattureInCloudSupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
