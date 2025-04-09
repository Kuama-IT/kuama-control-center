import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/env/server-env";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

const client = postgres(serverEnv.databaseUrl, {
  prepare: false, // Disable prefetch as it is not supported for "Transaction" pool mode
});

export const db = drizzle({
  casing: "snake_case",
  client,
  logger: serverEnv.showDatabaseLogs,
  schema: { ...schema, ...relations },
});
