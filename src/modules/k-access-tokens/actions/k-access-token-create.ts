"use server";
import {
  KAccessTokenCreate,
  kAccessTokenSchemaCreate,
} from "@/drizzle/drizzle-types";
import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { firstOrThrow } from "@/utils/array-utils";
import { eq } from "drizzle-orm";

async function createKAccessToken(dto: KAccessTokenCreate) {
  // ensure correct type
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

  return {
    message: `Access token ${parsed.purpose} created`,
    data: firstOrThrow(record),
  };
}

const handled = handleServerErrors(createKAccessToken);

export default handled;

export type CreateKAccessTokenResult = Awaited<
  ReturnType<typeof createKAccessToken>
>;
