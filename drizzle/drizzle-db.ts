import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/env/server-env";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

// TODO clean up this mess https://github.com/orgs/supabase/discussions/21789#discussioncomment-11494102
// TLDR; during development, multiple clients get instantiated, which causes the connection pool to be exhausted (due to hot reloading)
const createDb = () => {
  const client = postgres(serverEnv.databaseUrl, {
    prepare: false,
    max: 5,
  });
  const db = drizzle({
    casing: "snake_case",
    client,
    logger: false,
    schema: { ...schema, ...relations },
  });

  return db;
};
declare global {
  var _db: ReturnType<typeof createDb> | undefined;
}

if (!global._db) {
  global._db = createDb();
}

export const db = global._db;
