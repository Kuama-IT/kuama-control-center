import { db } from "@/drizzle/drizzle-db";
import { kInvoices } from "@/drizzle/schema";
import { sum } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

async function kClientGetOverallInvoicedAmount() {
  const amounts = await db
    .select({ value: sum(kInvoices.amountGross) })
    .from(kInvoices);
  const amount = firstOrThrow(amounts);

  if (!amount.value) {
    return 0;
  }

  const parsed = parseFloat(amount.value);
  if (isNaN(parsed)) {
    throw new Error("Could not compute overall invoiced amount");
  }

  return parsed;
}

export default handleServerErrors(kClientGetOverallInvoicedAmount);
