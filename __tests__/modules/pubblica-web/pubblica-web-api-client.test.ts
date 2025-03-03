import { describe, expect, test } from "vitest";
import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import { serverEnv } from "@/env/server-env";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { isFailure } from "@/utils/server-action-utils";
import * as fs from "node:fs";
import { parseSalary } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-utils";

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
  //
  // test("it fetches all payslips for a given employee", async () => {
  //   const id = 125;
  //   const employees = await kEmployeesServer.listAll();
  //   if (isFailure(employees)) {
  //     return;
  //   }
  //   await client.authenticate();
  //   for (const employee of employees) {
  //     // Mark & Dan are not employee,
  //     const email = employee.email ?? "";
  //     if (email === "marco@kuama.it" || email === "daniele@kuama.net") {
  //       continue;
  //     }
  //
  //     const res = await client.fetchPayslipsForEmployee(
  //       employee.fullName?.toUpperCase() ?? "",
  //     );
  //
  //     expect(res.length).not.toBe(0);
  //   }
  // });
});
