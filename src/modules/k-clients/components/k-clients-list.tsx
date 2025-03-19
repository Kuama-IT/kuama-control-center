import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { KClientCard } from "@/modules/k-clients/components/k-client-card";
import { Title } from "@/modules/ui/components/title";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { auth } from "@/modules/auth/auth";

export default async function KClientsList() {
  const clients = await kClientsServer.listAll();
  const session = await auth();
  if (isFailure(clients)) {
    return <ErrorMessage failure={clients} />;
  }
  const totalInvoicedAmount = await kClientsServer.getOverallInvoicedAmount();
  if (isFailure(totalInvoicedAmount)) {
    return <ErrorMessage failure={totalInvoicedAmount} />;
  }
  return (
    <div className="pt-16">
      <Title>Clients</Title>
      {session?.user?.isAdmin && (
        <p className="font-bold">
          &euro; {new Intl.NumberFormat().format(totalInvoicedAmount)}
        </p>
      )}

      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-3 py-8 items-center">
        {clients.map((client, index) => (
          <KClientCard key={client.id} client={client} index={index / 10} />
        ))}
      </div>
    </div>
  );
}
