import { describe, expect, test } from "vitest";
import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import * as fs from "node:fs";
import { serverEnv } from "@/env/server-env";

describe("pubblica-web-api", () => {
  const client = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword,
  );

  test("fake test", () => {
    expect(1).toBe(1);
  });

  // test("it authenticates and sets cookies", async () => {
  //   const res = await client.authenticate();
  //   expect(res.AuthToken).not.toBeNull();
  // });
  //
  // test("it fetches full list of payslip of a given month", async () => {
  //   const date = new Date();
  //   date.setFullYear(2021);
  //   date.setMonth(0);
  //   await client.authenticate();
  //   const res = await client.fetchPayslips(date);
  //   // write contents to file
  //   fs.writeFileSync(res.name, res.bytes);
  // });
});
