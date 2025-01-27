import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { KClientCard } from "@/modules/k-clients/components/k-client-card";

export default async function KClientsList() {
  const clients = await kClientsServer.listAll();
  return (
    <div className="grid gap-12 grid-cols-3 py-8">
      {clients.map((client, index) => (
        <KClientCard key={client.id} client={client} index={index / 10} />
      ))}
    </div>
  );
}
