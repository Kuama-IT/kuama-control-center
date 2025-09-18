import { describe, expect, test } from "vitest";
import * as fs from "node:fs";
import { serverEnv } from "@/env/server-env";
import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import { pubblicaWebUtils } from "@/modules/pubblica-web/pubblica-web.utils";

describe("parse pubblica web data", () => {
  const client = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword
  );

  test("fake test", () => {
    expect(1).toBe(1);
  });

  test("it downloads salary by year and month", async () => {
    await client.authenticate();
    const payslips = await client.fetchPayslips(2022, 8);

    // write to file the first pdf
    fs.writeFileSync(
      "__tests__/modules/pubblica-web/Cedolino-2022-08-0000.pdf",
      Buffer.from(payslips.bytes)
    );
  });

  test("it parses multiple salary pdf", async () => {
    const pdfBytes = fs.readFileSync(
      "__tests__/modules/pubblica-web/Cedolino-2022-08-0000.pdf"
    );
    const res = await pubblicaWebUtils.parseMultiPageSalaries(
      new Uint8Array(pdfBytes).buffer
    );
    const { fullName } = res[0];

    expect(fullName).toBe("BALDAN GIANMARIA");
  });

  test("it extrapolate fullname from raw string", () => {
    const rawContent =
      "BLDGMR98L18D442D                                  17         BALDAN GIANMARIA";
    const fullName =
      pubblicaWebUtils.tryParseFullNameFromOddContent(rawContent);
    expect(fullName).toBe("BALDAN GIANMARIA");
  });

  test("it downloads monthly balance by year and month", async () => {
    await client.authenticate();
    const balance = await client.fetchMonthlyBalance(2022, 7);

    // write to file the first pdf
    fs.writeFileSync(
      "__tests__/modules/pubblica-web/Bilancino-2022-07-0000.pdf",
      Buffer.from(balance!.bytes)
    );
  });

  test("it parses monthly total business cost from balance pdf", async () => {
    const pdfBytes = fs.readFileSync(
      "__tests__/modules/pubblica-web/Bilancino-2022-07-0000.pdf"
    );

    const res = await pubblicaWebUtils.parseSalaryMonthlyBalance(
      new Uint8Array(pdfBytes).buffer
    );

    expect(res.totalBusinessCost).greaterThan(0);
  });

  test("it computes employee monthly cost based on gross and total business cost", async () => {
    const pdfBytes = fs.readFileSync(
      "__tests__/modules/pubblica-web/Cedolino-2023-01-0000.pdf"
    );
    const salaries = await pubblicaWebUtils.parseMultiPageSalaries(
      new Uint8Array(pdfBytes).buffer
    );

    const pdfBalanceBytes = fs.readFileSync(
      "__tests__/modules/pubblica-web/Bilancino-2023-01-0000.pdf"
    );

    const balance = await pubblicaWebUtils.parseSalaryMonthlyBalance(
      new Uint8Array(pdfBalanceBytes).buffer
    );

    const { totalBusinessCost } = balance;
    const totalGross = salaries.reduce((sum, s) => sum + s.gross, 0);

    const employeeCosts = pubblicaWebUtils.computeEmployeesMonthlyCost(
      salaries.map((s) => ({
        gross: s.gross,
        fullName: s.fullName,
      })),
      totalBusinessCost
    );

    // 1. La somma dei costi aziendali deve tornare col totale
    expect(
      employeeCosts.reduce((sum, e) => sum + e.businessCost, 0)
    ).toBeCloseTo(totalBusinessCost, 2);

    // 2. Ogni quota deve corrispondere alla proporzione del lordo
    employeeCosts.forEach((e) => {
      expect(e.quota).toBeCloseTo(e.gross / totalGross, 6);
    });

    // 3. Gli oneri devono essere quota * (costo aziendale - totale lordo)
    const oneriTotali = totalBusinessCost - totalGross;
    employeeCosts.forEach((e) => {
      expect(e.oneri).toBeCloseTo(e.quota * oneriTotali, 2);
    });

    // 4. Il costo aziendale deve essere lordo + oneri
    employeeCosts.forEach((e) => {
      expect(e.businessCost).toBeCloseTo(e.gross + e.oneri, 2);
    });
  });
});
