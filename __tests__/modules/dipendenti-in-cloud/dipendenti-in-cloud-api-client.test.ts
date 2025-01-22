import { expect, test, describe } from "vitest";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";

// N.B. This was written just to build the client, it is performing real calls and presumes a working env is present
describe("dipendenti-in-cloud-api", () => {
  // just to make vitest happy and keep this suite of tests for reference
  test("fake test", () => {
    expect(1).toBe(1);
  });
  // test("get employees", async () => {
  //   const employees = await dipendentiInCloudApiClient.getEmployees();
  //
  //   expect(employees.length).toBe(15);
  // });
  //
  // test("get daily timesheet", async () => {
  //   const employees = await dipendentiInCloudApiClient.getEmployees();
  //
  //   const dailyTimesheet = await dipendentiInCloudApiClient.getMonthlyTimesheet(
  //     new Date(),
  //     employees,
  //   );
  //
  //   expect(Object.keys(dailyTimesheet).length).toBe(employees.length);
  // });
  //
  // test("get payrolls", async () => {
  //   const employees = await dipendentiInCloudApiClient.getEmployees();
  //   const firstEmployee = employees[0];
  //   const payrolls = await dipendentiInCloudApiClient.getPayrolls(
  //     firstEmployee.id,
  //     2024,
  //   );
  //   expect(payrolls.length).greaterThan(1);
  // });
});
