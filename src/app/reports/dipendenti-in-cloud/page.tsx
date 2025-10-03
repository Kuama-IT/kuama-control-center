import DipendentiInCloudReport from "@/modules/dipendenti-in-cloud/components/dipendenti-in-cloud-report";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { isFailure } from "@/utils/server-action-utils";
import {
  timesheetsAbsenceServer,
  type AbsenceDaysList,
  type AbsenceReasonList,
} from "@/modules/timesheets/timesheets-absence.server";
import { parse } from "date-fns";
import { accessTokensServer } from "@/modules/access-tokens/access-tokens.server";
import {
  accessTokenParamsSchema,
  datePeriodParamsSchema,
  PageParams,
  SearchParams,
} from "@/modules/routing/schemas/routing-schemas";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import {
  timesheetsClosuresServer,
  type ClosuresList,
} from "@/modules/timesheets/timesheets-closures.server";

const paramsSchema = datePeriodParamsSchema.and(accessTokenParamsSchema);

export default async function Page({ searchParams }: PageParams) {
  const parsedParams = paramsSchema.safeParse(await searchParams);

  if (!parsedParams.success) {
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "__invalid_params__",
          message: JSON.stringify(parsedParams.error, null, 2),
        }}
      />
    );
  }

  const result = await accessTokensServer.manage(parsedParams.data.accessToken);
  if (isFailure(result)) {
    return <ErrorMessage failure={result} />;
  }

  const employees = await kEmployeesServer.listAll();

  if (isFailure(employees)) {
    return <ErrorMessage failure={employees} />;
  }

  const from = parse(parsedParams.data.from, "dd-MM-yyyy", new Date());
  const to = parse(parsedParams.data.to, "dd-MM-yyyy", new Date());

  let absences: AbsenceDaysList;
  try {
    absences = await timesheetsAbsenceServer.list({
      from,
      to,
    });
  } catch (error) {
    console.error(error);
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "timesheets_absences_load_failed",
          message: error instanceof Error ? error.message : String(error),
        }}
      />
    );
  }

  let absenceReasons: AbsenceReasonList;
  try {
    absenceReasons = await timesheetsAbsenceServer.listReasons();
  } catch (error) {
    console.error(error);
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "timesheets_absence_reasons_load_failed",
          message: error instanceof Error ? error.message : String(error),
        }}
      />
    );
  }

  let closures: ClosuresList;
  try {
    closures = await timesheetsClosuresServer.list();
  } catch (error) {
    console.error(error);
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "timesheets_closures_load_failed",
          message: error instanceof Error ? error.message : String(error),
        }}
      />
    );
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

export const dynamic = "force-dynamic"; // opt-out of static rendering
