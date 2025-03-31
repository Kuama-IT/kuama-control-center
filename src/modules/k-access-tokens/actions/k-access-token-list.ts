"use server";

import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";

async function listKAccessTokens() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("You are not allowed to list access tokens");
  }

  return db.select().from(kAccessTokens);
}

const handled = handleServerErrors(listKAccessTokens);

export default handled;

export type ListKAccessTokensResult = Awaited<
  ReturnType<typeof listKAccessTokens>
>;
