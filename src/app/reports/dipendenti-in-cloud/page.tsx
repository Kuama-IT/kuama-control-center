import DipendentiInCloudReport from "@/modules/dipendenti-in-cloud/components/dipendenti-in-cloud-report";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { isFailure } from "@/utils/server-action-utils";
import { kAbsenceDaysServer } from "@/modules/k-absence-days/k-absence-days-server";
import { endOfMonth, parse, startOfMonth } from "date-fns";

export default async function Page() {
  const employees = await kEmployeesServer.listAll();

  if (isFailure(employees)) {
    return <pre>Could not load employees</pre>;
  }

  // TODO from and to should be parameters
  // TODO add token to the request
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
