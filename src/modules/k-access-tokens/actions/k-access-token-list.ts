"use server";

import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { unstable_cache } from "next/cache";

async function listKAccessTokensInternal() {
  return db.select().from(kAccessTokens);
}

const cached = unstable_cache(listKAccessTokensInternal, [], {
  revalidate: 60,
  tags: ["k-access-tokens"],
});

async function listKAccessTokens() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("You are not allowed to list access tokens");
  }

  return cached();
}

const handled = handleServerErrors(listKAccessTokens);

export default handled;

export type ListKAccessTokensResult = Awaited<
  ReturnType<typeof listKAccessTokens>
>;
