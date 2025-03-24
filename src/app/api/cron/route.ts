import { NextResponse } from "next/server";
import syncDipendentiInCloudPayrollsAction from "@/modules/dipendenti-in-cloud/actions/sync-dipendenti-in-cloud-payrolls-action";

// TODO THIS SHOULD ONLY SEND CURRENT MONTH PAYROLLS TO DIPENDENTI IN CLOUD
export async function GET() {
  // 1. Sync payrolls from Dipendenti in Cloud -> Kuama Control Center

  const currentYear = new Date().getFullYear();
  let startYear = 2021;
  while (startYear <= currentYear) {
    await syncDipendentiInCloudPayrollsAction([startYear]);
    startYear++;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // let's try not to get rate limited
  }

  // TODO 2. Search for missing payslips in PubblicaWeb and send them to Dipendenti in Cloud

  return NextResponse.json({ ok: true });
}
