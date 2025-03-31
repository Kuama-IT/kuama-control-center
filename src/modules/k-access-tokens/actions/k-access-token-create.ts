"use server";
import {
  KAccessTokenCreate,
  kAccessTokenSchemaCreate,
} from "@/drizzle/drizzle-types";
import { auth } from "@/modules/auth/auth";
import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";

async function createKAccessToken(dto: KAccessTokenCreate) {
  // ensure correct type
  const parsed = kAccessTokenSchemaCreate.parse(dto);

  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("You are not allowed to create an access token");
  }

  await db
    .insert(kAccessTokens)
    .values({ ...parsed, token: crypto.randomUUID() });

  return {
    message: `Access token ${parsed.purpose} created`,
  };
}

const handled = handleServerErrors(createKAccessToken);

export default handled;

export type CreateKAccessTokenResult = Awaited<
  ReturnType<typeof createKAccessToken>
>;
