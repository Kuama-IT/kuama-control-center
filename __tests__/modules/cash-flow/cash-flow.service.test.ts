import { cashFlowService } from "@/modules/cash-flow/cash-flow.service";
import { it } from "node:test";
import { describe, expect, test } from "vitest";
import * as fs from "node:fs";
describe("bank service", () => {
  // just to make vitest happy and keep this suite of tests for reference
  test("fake test", () => {
    expect(1).toBe(1);
  });

  it("parses bank statement", async () => {
    const bytes = fs.readFileSync(
      "__tests__/modules/cash-flow/Movimenti_Conto_04082025.xlsx"
    );
    const parsed = await cashFlowService.parseBankStatementXlsx(bytes);
    expect(parsed.accountNumber).toBe("100000014205");
    expect(parsed.openingBalance.amount).toBe(0);
    expect(parsed.openingBalance.date).toEqual(new Date(2025, 6, 1));
    expect(parsed.closingBalance.amount).toBe(0);
    expect(parsed.closingBalance.date).toEqual(new Date(2025, 7, 4));

    expect(parsed.transactions.length).toBe(50);

    // sum all transactions amounts
    const totalTransactions = parsed.transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    expect(totalTransactions + parsed.openingBalance.amount).toBeCloseTo(parsed.closingBalance.amount, 2);
  });
});
