import { clientsServer } from "@/modules/clients/clients.server";
import ClientCard from "./client-card";
import { Title } from "@/modules/ui/components/title";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { auth } from "@/modules/auth/auth";

export default async function ClientsList() {
  const clients = await clientsServer.allOrganizations();
  const session = await auth();
  if (isFailure(clients)) {
    return <ErrorMessage failure={clients} />;
  }
  // const totalInvoicedAmount = await clientsServer.getOverallInvoicedAmount();
  // if (isFailure(totalInvoicedAmount)) {
  // 	return <ErrorMessage failure={totalInvoicedAmount} />;
  // }
  const totalInvoicedAmount = "0.0";
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
          <ClientCard key={client.id} client={client} index={index / 10} />
        ))}
      </div>
    </div>
  );
}
