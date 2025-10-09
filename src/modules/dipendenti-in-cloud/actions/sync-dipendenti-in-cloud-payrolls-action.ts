"use server";

import { db } from "@/drizzle/drizzle-db";
import { documents, employees, payslips } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { getSalaryHistoryWithGrossAmounts } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-utils";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { eq } from "drizzle-orm";
import { firstOrThrow } from "@/utils/array-utils";
import { createHash } from "crypto";
import type { SalaryWithGross } from "@/modules/dipendenti-in-cloud/schemas/dipendenti-in-cloud-schemas";

function sha256(buffer: Uint8Array | Buffer) {
  const hash = createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

const handled = handleServerErrors(async (years: number[]) => {
  const history = await getSalaryHistoryWithGrossAmounts(
    dipendentiInCloudApiClient,
    years
  );

  let created = 0;
  await db.transaction(async (tx) => {
    for (const employeeHistory of history) {
      // Map DIC employee to local employee
      const existing = await tx
        .select()
        .from(employees)
        .where(
          eq(
            employees.dipendentiInCloudId,
            employeeHistory.employeeId.toString()
          )
        )
        .limit(1);
      const employeeRow = existing[0];
      if (!employeeRow?.id) continue; // skip unmapped

      for (const [yearStr, salaries] of Object.entries(
        employeeHistory.salaries
      ) as [string, SalaryWithGross[]][]) {
        const year = Number(yearStr);
        for (const salary of salaries) {
          // Download and store document
          const file = await dipendentiInCloudApiClient.downloadSalary(salary);
          const buffer = Buffer.from(file);
          const digest = sha256(buffer);
          const fileName = `dic-payroll-${employeeHistory.employeeId}-${salary.date}.pdf`;

          const insertedDoc = await tx
            .insert(documents)
            .values({
              content: buffer as any,
              sizeInBytes: buffer.byteLength,
              sha256: digest,
              mime: "application/pdf",
              fileName,
              extension: "pdf",
            })
            .onConflictDoNothing({ target: documents.sha256 })
            .returning({ id: documents.id });

          let documentId = insertedDoc[0]?.id;
          if (!documentId) {
            const doc = await tx
              .select({ id: documents.id })
              .from(documents)
              .where(eq(documents.sha256, digest))
              .limit(1);
            documentId = firstOrThrow(doc).id;
          }

          // Upsert payslip
          const d = new Date(salary.date);
          const month = d.getMonth() + 1; // 1..12
          await tx
            .insert(payslips)
            .values({
              employeeId: employeeRow.id,
              year,
              month,
              gross: salary.gross ?? 0,
              net: salary.net ?? 0,
              documentId,
            })
            .onConflictDoNothing();
          created++;
        }
      }
    }
  });

  return { message: `Synced payrolls entries created or ensured: ${created}` };
});

export default handled;
