import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/env/server-env";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

const client = postgres(serverEnv.databaseUrl, {
  prepare: false,
  connect_timeout: 3000,
});
export const db = drizzle({
  casing: "snake_case",
  client,
  logger: true,
  schema: { ...schema, ...relations },
});
