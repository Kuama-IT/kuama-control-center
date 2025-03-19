import { Title } from "@/modules/ui/components/title";
import SyncClients from "@/modules/fatture-in-cloud/components/sync-clients";
import { SyncInvoices } from "@/modules/fatture-in-cloud/components/sync-invoices";
import { Separator } from "@/components/ui/separator";

export default async function SyncFattureInCloud() {
  return (
    <div className="border rounded-lg p-4 col-span-4 flex flex-col gap-4">
      <Title>Fatture in cloud</Title>
      <div className="flex flex-col gap-8">
        <SyncClients />
        <Separator />
        <SyncInvoices />
      </div>
    </div>
  );
}
