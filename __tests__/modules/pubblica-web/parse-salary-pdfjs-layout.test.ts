import { describe, expect, test } from "vitest";
import * as fs from "node:fs";
import { pubblicaWebUtils } from "@/modules/pubblica-web/pubblica-web.utils";
import { it } from "node:test";

// This test uses the sample PDF already committed to the repo to avoid network dependence
// File present in repo structure: __tests__/modules/pubblica-web/Cedolino-2024-01-0000.pdf

describe("parse multiple payslip via PDF.js layout", () => {
  test("extracts main fields from first page", async () => {
    const samplePath = "__tests__/modules/pubblica-web/Cedolino-2022-08-0000";
    const pdfBytes = fs.readFileSync(samplePath);

    const payrolls = await pubblicaWebUtils.parseMultiPageSalaries(
      new Uint8Array(pdfBytes).buffer
    );
    for (const res of payrolls) {
      console.log(res);
      expect(res.gross).toBeGreaterThan(0);
      expect(res.net).toBeGreaterThan(0);
      expect(
        typeof res.fullName === "string" && res.fullName.length
      ).toBeTruthy();
      expect(res.cf.length).toBe(16);
      expect(
        res.birthDate.getFullYear() - new Date().getFullYear()
      ).toBeGreaterThan(18);
      expect(res.hireDate.getFullYear()).toBeGreaterThan(2000);
      expect(res.permissionsHoursBalance).toBeGreaterThanOrEqual(0);
      expect(res.holidaysHoursBalance).toBeGreaterThanOrEqual(0);
      expect(res.rolHoursBalance).toBeGreaterThanOrEqual(0);
      expect(res.workedDays).toBeGreaterThanOrEqual(0);
      expect(res.workedHours).toBeGreaterThanOrEqual(0);
    }
  });

  it("extracts main fields from company employeess balance file via PDF.js", async () => {
  });
});
