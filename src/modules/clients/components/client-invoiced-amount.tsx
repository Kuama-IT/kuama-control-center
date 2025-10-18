import { clientsServer } from "@/modules/clients/clients.server";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";

export default async function ClientInvoicedAmount({
    clientId,
}: {
    clientId: number;
}) {
    const invoicedAmount = await clientsServer.getTotalInvoicedAmount({
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
