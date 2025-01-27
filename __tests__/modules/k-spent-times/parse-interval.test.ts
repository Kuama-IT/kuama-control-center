import { expect, test, describe } from "vitest";
import { db } from "@/drizzle/drizzle-db";
import parsePostgresInterval from "postgres-interval";
describe("kSpentTimes parse interval", () => {
  test("should parse interval", async () => {
    const spentTime = await db.query.kSpentTimes.findFirst();

    console.log(
      spentTime?.duration,
      parsePostgresInterval(spentTime?.duration!),
    );
  });
});
