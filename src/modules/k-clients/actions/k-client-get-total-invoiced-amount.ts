import { db } from "@/drizzle/drizzle-db";
import { kClientVats, kInvoices } from "@/drizzle/schema";
import { eq, sum } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function kClientGetTotalInvoicedAmount({
  clientId,
}: {
  clientId: number;
}) {
  const vats = await db
    .select()
    .from(kClientVats)
    .where(eq(kClientVats.clientId, clientId));

  const amounts = await db
    .select({ value: sum(kInvoices.amountGross) })
    .from(kInvoices)
    .where(
      inArray(
        kInvoices.clientVat,
        vats.map((it) => it.id),
      ),
    );
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
