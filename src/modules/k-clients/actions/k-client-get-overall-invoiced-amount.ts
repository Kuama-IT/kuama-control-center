import { db } from "@/drizzle/drizzle-db";
import { kInvoices } from "@/drizzle/schema";
import { sum } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

async function kClientGetOverallInvoicedAmount() {
  const session = await auth();
  if (!session || !session.user?.isAdmin) {
    throw new Error("Only admin is allowed to invoke this action");
  }
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

const handled = handleServerErrors(kClientGetOverallInvoicedAmount);
export default handled;
