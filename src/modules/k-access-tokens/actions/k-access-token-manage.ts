import { db } from "@/drizzle/drizzle-db";
import { kAccessTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { handleServerErrors } from "@/utils/server-action-utils";

const INFINITE_USAGES = -1;

async function kAccessTokenManage(accessToken: string) {
  // Check if the access token exists
  const queryResult = await db
    .select()
    .from(kAccessTokens)
    .where(eq(kAccessTokens.token, accessToken));

  // If token does not exist throw an error
  const token = firstOrThrow(queryResult);

  // Check if the token is eligible for infinite usages
  if (token.allowedUsages === INFINITE_USAGES) {
    // If it is, update usages count and return a success state
    await db
      .update(kAccessTokens)
      .set({ usageCount: (token.usageCount ?? 0) + 1 })
      .where(eq(kAccessTokens.id, token.id));
    return; // token exists and can be used forever
  }

  // Check if token has a max allowed usages
  if (token.allowedUsages != null) {
    const usageCount = token.usageCount ?? 0;
    const allowedUsages = token.allowedUsages;

    if (usageCount > allowedUsages) {
      // should never happen since we delete the token if usage count matches allowed usages
      throw new Error("Token has reached the maximum allowed usages");
    }

    if (usageCount + 1 === allowedUsages) {
      await db.delete(kAccessTokens).where(eq(kAccessTokens.id, token.id));
      return; // token exists and has been deleted
    }

    // Token can still be used, update usage count
    await db
      .update(kAccessTokens)
      .set({ usageCount: (token.usageCount ?? 0) + 1 })
      .where(eq(kAccessTokens.id, token.id));
    return; // token exists and can be used forever
  }

  // Check if token is expired
  const now = new Date();
  const expirationDate = token.expiresAt;
  if (expirationDate && expirationDate < now) {
    // delete the token and throw an error
    await db.delete(kAccessTokens).where(eq(kAccessTokens.id, token.id));
    throw new Error("Token has expired");
  }

  // Token is not expired, update usage count
  await db
    .update(kAccessTokens)
    .set({ usageCount: (token.usageCount ?? 0) + 1 })
    .where(eq(kAccessTokens.id, token.id));
}

const managed = handleServerErrors(kAccessTokenManage);
export default managed;
