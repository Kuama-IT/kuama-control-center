"use server";
import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { eq } from "drizzle-orm";
import {
  KAccessTokenCreate,
  kAccessTokenSchemaCreate,
} from "@/modules/k-access-tokens/schemas/k-access-token-schemas";
import { revalidateTag } from "next/cache";

async function createKAccessToken(dto: KAccessTokenCreate) {
  // ensure dto type is correct
  const parsed = kAccessTokenSchemaCreate.parse(dto);

  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("You are not allowed to create an access token");
  }

  const res = await db
    .insert(kAccessTokens)
    .values({ ...parsed, token: crypto.randomUUID() })
    .returning({ insertedId: kAccessTokens.id });
  if (res.length === 0) {
    throw new Error("Error while creating access token");
  }

  const { insertedId } = firstOrThrow(res);

  const record = await db
    .select()
    .from(kAccessTokens)
    .where(eq(kAccessTokens.id, insertedId))
    .limit(1);

  // invalidate access token cache
  revalidateTag("k-access-tokens");

  return {
    message: `Access token ${parsed.purpose} created`,
    data: firstOrThrow(record),
  };
}

const handled = handleServerErrors(createKAccessToken);

export default handled;
