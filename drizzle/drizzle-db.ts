import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/env/server-env";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

const client = postgres(serverEnv.databaseUrl, {
  prepare: false,
  connect_timeout: 3000,
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Seconds a client must sit idle before closing
});
export const db = drizzle({
  casing: "snake_case",
  client,
  logger: serverEnv.isDev,
  schema: { ...schema, ...relations },
});
