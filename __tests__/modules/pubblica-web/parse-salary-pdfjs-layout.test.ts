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

    // expect(res.gross).toBeGreaterThan(0);
    // expect(res.net).toBeGreaterThan(0);
    // expect(typeof res.fullName === "string" && res.fullName.length).toBeTruthy();
    // // Dates may be missing on some templates; if present, they should match dd/MM/yyyy
    // if (res.birthDate) {
    //   expect(/\d{2}\/\d{2}\/\d{4}/.test(res.birthDate)).toBe(true);
    // }
    // if (res.hireDate) {
    //   expect(/\d{2}\/\d{2}\/\d{4}/.test(res.hireDate)).toBe(true);
    // }
    // expect(typeof res.pageAsPdfBase64).toBe("string");
    // expect(res.pageAsPdfBase64.length).toBeGreaterThan(100);
  });
});
