import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { serverEnv } from "@/env/server-env";
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.databaseUrl,
  },
});
