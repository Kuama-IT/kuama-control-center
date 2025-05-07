"use server";
import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

async function internalGetNotExpiredKAccessToken() {
  const res = await db
    .select()
    .from(kAccessTokens)
    .where(eq(kAccessTokens.allowedUsages, -1));
  return firstOrThrow(res);
}

const cached = unstable_cache(internalGetNotExpiredKAccessToken, [], {
  revalidate: 60,
  tags: ["k-access-tokens-not-expired"],
});

async function getNotExpiredKAccessToken() {
  // ensure dto type is correct
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("You are not allowed to list access tokens");
  }

  return cached();
}

const handled = handleServerErrors(getNotExpiredKAccessToken);

export default handled;
