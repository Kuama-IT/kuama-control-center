import { db } from "@/drizzle/drizzle-db";
import { closures } from "@/drizzle/schema";

async function selectClosures() {
  return db.select().from(closures);
}

export const timesheetsClosuresDb = {
  selectClosures,
};

export type ClosuresDbResult = Awaited<ReturnType<typeof selectClosures>>;
