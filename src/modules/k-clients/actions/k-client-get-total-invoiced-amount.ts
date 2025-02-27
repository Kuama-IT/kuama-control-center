import { db } from "@/drizzle/drizzle-db";
import { kClients, kInvoices } from "@/drizzle/schema";
import { eq, sum } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

async function kClientGetTotalInvoicedAmount({
  clientId,
}: {
  clientId: number;
}) {
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }

  const clientWithVatsRecords = await db.query.kClients.findMany({
    with: {
      kClientsVats: {
        with: {
          kVat: true,
        },
      },
    },
    where: eq(kClients.id, clientId),
  });

  const clientWithVats = firstOrThrow(clientWithVatsRecords);
  const vats = clientWithVats.kClientsVats.map(({ kVat }) => kVat.id);
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
