import { db } from "@/drizzle/drizzle-db";
import { kClosures } from "@/drizzle/schema";

async function selectClosures() {
  return db.select().from(kClosures);
}

export const timesheetsClosuresDb = {
  selectClosures,
};

export type ClosuresDbResult = Awaited<ReturnType<typeof selectClosures>>;
