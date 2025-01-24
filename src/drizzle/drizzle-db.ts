import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/env/server-env";
import postgres from "postgres";
export const client = postgres(serverEnv.databaseUrl, { prepare: false });
export const db = drizzle({
  casing: "snake_case",
  client,
});
