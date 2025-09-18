"use server";

import { PubblicaWebApi } from "@/modules/pubblica-web/pubblica-web-api-client";
import { serverEnv } from "@/env/server-env";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { pubblicaWebPayrolls } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { pubblicaWebUtils } from "../pubblica-web.utils";

export const handledSyncEmployeePayrolls = handleServerErrors(async function ({
  year,
}: {
  year: string;
}) {
  // clear existing payrolls for the year
  await db
    .delete(pubblicaWebPayrolls)
    .where(eq(pubblicaWebPayrolls.year, parseInt(year)));

  const pubblicaWebClient = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword,
  );

  await pubblicaWebClient.authenticate();

  // fetch all monthly payslips for the year
  for (let month = 1; month < 14; month++) {
    let payslips: {
      bytes: ArrayBuffer;
      mimeType: string;
      name: string;
    };
    try {
      payslips = await pubblicaWebClient.fetchPayslips(parseInt(year), month);
    } catch (e) {
      console.log(`No payslip found for ${year}/${month}`);
      continue;
    }

    console.log(`fetching payslips for ${year}/${month}`);
    const salaryInfos = await pubblicaWebUtils.parseMultiPageSalaries(
      new Uint8Array(payslips.bytes).buffer,
    );

    // payslip.name = LUL-2021-01.pdf

    for (const salaryInfo of salaryInfos) {
      console.log(
        `Saving payslip for ${salaryInfo.fullName} - ${year}/${month} - birthdate: ${salaryInfo.birthDate} - net: ${salaryInfo.net} - gross: ${salaryInfo.gross}`,
      );
      await db
        .insert(pubblicaWebPayrolls)
        .values({
          employeeName: salaryInfo.fullName,
          year: parseInt(year),
          month: month,
          birthDate: salaryInfo.birthDate,
          net: salaryInfo.net,
          gross: salaryInfo.gross,
        })
        .onConflictDoUpdate({
          target: [
            pubblicaWebPayrolls.employeeName,
            pubblicaWebPayrolls.year,
            pubblicaWebPayrolls.month,
          ],
          set: {
            net: salaryInfo.net,
            gross: salaryInfo.gross,
            birthDate: salaryInfo.birthDate,
          },
        });
    }
  }
});

export const handledListRootFolders = handleServerErrors(async function () {
  const pubblicaWebClient = new PubblicaWebApi(
    serverEnv.pubblicaWebUsername,
    serverEnv.pubblicaWebPassword,
  );

  await pubblicaWebClient.authenticate();

  const folders = await pubblicaWebClient.listRootFolders();
  const filteredFolders = folders.filter((it) => it.text.length === 4);

  // order by employee name
  filteredFolders.sort((a, b) => a.text.localeCompare(b.text));
  const res = [];
  for (const folder of filteredFolders) {
    // fetch associated payrolls
    const payrolls = await db
      .select()
      .from(pubblicaWebPayrolls)
      .where(eq(pubblicaWebPayrolls.year, parseInt(folder.text)))
      .orderBy(desc(pubblicaWebPayrolls.year), desc(pubblicaWebPayrolls.month));

    res.push({ ...folder, payrolls });
  }

  return res;
});
