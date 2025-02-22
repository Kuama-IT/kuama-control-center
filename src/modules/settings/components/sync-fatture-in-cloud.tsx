import { Title } from "@/modules/ui/components/title";
import SyncClients from "@/modules/settings/components/sync-clients";
import { SyncInvoices } from "@/modules/settings/components/sync-invoices";

export default async function SyncFattureInCloud() {
  return (
    <div className="border rounded-lg p-4 col-span-4 flex flex-col gap-4">
      <Title>Fatture in cloud</Title>
      <div className="flex gap-8">
        <SyncClients />
        <SyncInvoices />
      </div>
    </div>
  );
}
