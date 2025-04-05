import DipendentiInCloudReport from "@/modules/dipendenti-in-cloud/components/dipendenti-in-cloud-report";
import { kEmployeesServer } from "@/modules/k-employees/k-employee-server";
import { isFailure } from "@/utils/server-action-utils";
import { kAbsenceDaysServer } from "@/modules/k-absence-days/k-absence-days-server";
import { parse } from "date-fns";
import { kAccessTokensServer } from "@/modules/k-access-tokens/k-access-tokens-server";
import {
  accessTokenParamsSchema,
  datePeriodParamsSchema,
  PageParams,
  SearchParams,
} from "@/modules/routing/schemas/routing-schemas";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { kClosuresServer } from "@/modules/k-closures/k-closures-server";

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

  const result = await kAccessTokensServer.manage(
    parsedParams.data.accessToken,
  );
  if (isFailure(result)) {
    return <ErrorMessage failure={result} />;
  }

  const employees = await kEmployeesServer.listAll();

  if (isFailure(employees)) {
    return <ErrorMessage failure={employees} />;
  }

  const from = parse(parsedParams.data.from, "dd-MM-yyyy", new Date());
  const to = parse(parsedParams.data.to, "dd-MM-yyyy", new Date());

  const absences = await kAbsenceDaysServer.list({
    from,
    to,
  });

  if (isFailure(absences)) {
    return <ErrorMessage failure={absences} />;
  }

  const absenceReasons = await kAbsenceDaysServer.listReasons();
  if (isFailure(absenceReasons)) {
    return <ErrorMessage failure={absenceReasons} />;
  }

  const closures = await kClosuresServer.closures();
  if (isFailure(closures)) {
    return <ErrorMessage failure={closures} />;
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
