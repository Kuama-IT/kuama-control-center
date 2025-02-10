import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { KClientCard } from "@/modules/k-clients/components/k-client-card";
import { Title } from "@/modules/ui/components/title";

export default async function KClientsList() {
  const clients = await kClientsServer.listAll();
  return (
    <>
      <Title>Clients</Title>
      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-3 py-8 items-center">
        {clients.map((client, index) => (
          <KClientCard key={client.id} client={client} index={index / 10} />
        ))}
      </div>
    </>
  );
}
