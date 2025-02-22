import { db } from "@/drizzle/drizzle-db";
import { kClients, kInvoices } from "@/drizzle/schema";
import { eq, sum } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function kClientGetTotalInvoicedAmount({
  clientId,
}: {
  clientId: number;
}) {
  const clientWithVatsRecords = await db.query.kClients.findMany({
    with: {
      kVatsToClient: {
        with: {
          kVat: true,
        },
      },
    },
    where: eq(kClients.id, clientId),
  });

  const clientWithVats = firstOrThrow(clientWithVatsRecords);
  const vats = clientWithVats.kVatsToClient.map(({ kVat }) => kVat.id);
  const amounts = await db
    .select({ value: sum(kInvoices.amountGross) })
    .from(kInvoices)
    .where(inArray(kInvoices.vat, vats));
  const amount = firstOrThrow(amounts);
  if (!amount.value) {
    return 0;
  }

  const parsed = parseFloat(amount.value);
  if (isNaN(parsed)) {
    throw new Error("Could not compute client total invoiced amount");
  }

  return parsed;
}

export default handleServerErrors(kClientGetTotalInvoicedAmount);
