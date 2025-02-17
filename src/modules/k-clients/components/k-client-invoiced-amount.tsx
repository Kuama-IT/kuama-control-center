import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function KClientInvoicedAmount({
  clientId,
}: {
  clientId: number;
}) {
  const invoicedAmount = await kClientsServer.getTotalInvoicedAmount({
    clientId,
  });
  if (isFailure(invoicedAmount)) {
    return <ErrorMessage failure={invoicedAmount} />;
  }
  return (
    <div className="font-bold">
      &euro; {new Intl.NumberFormat().format(invoicedAmount)}
    </div>
  );
}
