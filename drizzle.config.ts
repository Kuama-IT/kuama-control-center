import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@/env/server-env";
export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: serverEnv.databaseUrl,
  },
});
