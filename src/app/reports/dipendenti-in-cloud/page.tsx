import DipendentiInCloudReport from "@/modules/dipendenti-in-cloud/components/dipendenti-in-cloud-report";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { isFailure } from "@/utils/server-action-utils";
import { kAbsenceDaysServer } from "@/modules/k-absence-days/k-absence-days-server";
import { endOfMonth, parse, startOfMonth } from "date-fns";
import { z } from "zod";
import { kAccessTokensServer } from "@/modules/k-access-tokens/k-access-tokens-server";

const paramsSchema = z.object({
  from: z.string(),
  to: z.string(),
  accessToken: z.string(),
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const parsedParams = paramsSchema.safeParse(await searchParams);

  if (!parsedParams.success) {
    return (
      <>
        <pre>{JSON.stringify(searchParams, null, 2)}</pre>
        <pre>{JSON.stringify(parsedParams.error, null, 2)}</pre>
      </>
    );
  }

  const result = await kAccessTokensServer.manage(
    parsedParams.data.accessToken,
  );
  if (isFailure(result)) {
    return <pre>Invalid or expired token</pre>;
  }
  const employees = await kEmployeesServer.listAll();

  if (isFailure(employees)) {
    return <pre>Could not load employees</pre>;
  }

  // TODO date it's fixed to march until we get acceptance from the payroll office
  const date = parse("10-03-2025", "dd-MM-yyyy", new Date());
  const from = startOfMonth(date);
  const to = endOfMonth(date);

  const absences = await kAbsenceDaysServer.list({
    from,
    to,
  });

  if (isFailure(absences)) {
    return <pre>Could not load absences</pre>;
  }

  const absenceReasons = await kAbsenceDaysServer.listReasons();
  if (isFailure(absenceReasons)) {
    return <pre>Could not load absence reasons</pre>;
  }

  const closures = await kAbsenceDaysServer.closures();
  if (isFailure(closures)) {
    return <pre>Could not load closures</pre>;
  }

  const uniqueReasons: string[] = [];
  for (const absence of absences) {
    const reason = absence.k_absence_days?.reasonCode;

    if (reason && !uniqueReasons.includes(reason)) {
      uniqueReasons.push(reason);
    }
  }

  return (
    <DipendentiInCloudReport
      from={from}
      to={to}
      absences={absences}
      employees={employees}
      uniqueAbsenceReasons={uniqueReasons}
      absenceReasons={absenceReasons}
      closures={closures}
    />
  );
}
