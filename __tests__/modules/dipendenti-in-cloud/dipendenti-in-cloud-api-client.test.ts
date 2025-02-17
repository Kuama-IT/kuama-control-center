import { describe, expect, test } from "vitest";

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

  // test("get salaries history", async () => {
  //   const salariesHistory = await getSalaryHistoryWithGrossAmounts(
  //     dipendentiInCloudApiClient,
  //     [2025],
  //   );
  //   for (const salaryHistory of salariesHistory) {
  //     for (const [_, salaries] of Object.entries(salaryHistory.salaries)) {
  //       for (const salary of salaries) {
  //         expect(salary.gross).not.toBeUndefined();
  //         expect(salary.gross).not.toBeNaN();
  //         expect(salary.gross).gt(1000);
  //         expect(salary.gross).lt(2500);
  //       }
  //     }
  //   }
  // });
});
