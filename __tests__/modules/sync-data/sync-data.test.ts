import { expect, test, describe } from "vitest";
import { syncData } from "@/modules/sync-data/sync-data";

describe("sync-data", () => {
  test("run", async () => {
    await syncData();
    expect(1).toBe(1);
  });
});
