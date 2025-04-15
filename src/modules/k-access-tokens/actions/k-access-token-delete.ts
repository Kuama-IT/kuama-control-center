"use server";
import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";
import { revalidateTag } from "next/cache";

async function deleteKAccessToken({ id }: { id: number }) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("You are not allowed to delete an access token");
  }

  const records = await db
    .select()
    .from(kAccessTokens)
    .where(eq(kAccessTokens.id, id));
  const record = firstOrThrow(records);

  await db.delete(kAccessTokens).where(eq(kAccessTokens.id, id));
  // invalidate access token cache
  revalidateTag("k-access-tokens");
  return {
    message: `Access token ${record.purpose} deleted`,
  };
}

const handled = handleServerErrors(deleteKAccessToken);

export default handled;

export type DeleteKAccessTokenResult = Awaited<
  ReturnType<typeof deleteKAccessToken>
>;
