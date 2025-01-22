import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/env/server-env";
import postgres from "postgres";
const client = postgres(serverEnv.databaseUrl);
const db = drizzle({ client });
