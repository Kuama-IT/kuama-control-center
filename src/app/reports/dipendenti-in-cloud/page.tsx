import { parse } from "date-fns";
import { accessTokensServer } from "@/modules/access-tokens/access-tokens.server";
import DipendentiInCloudReport from "@/modules/dipendenti-in-cloud/components/dipendenti-in-cloud-report";
import { employeesServer } from "@/modules/employees/employees.server";
import {
    accessTokenParamsSchema,
    datePeriodParamsSchema,
    type PageParams,
} from "@/modules/routing/schemas/routing-schemas";
import {
    type AbsenceDaysList,
    type AbsenceReasonList,
    type ClosuresList,
} from "@/modules/timesheets/schemas";
import { timesheetsServer } from "@/modules/timesheets/timesheets.server";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";

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

    const result = await accessTokensServer.manage(
        parsedParams.data.accessToken,
    );
    if (isFailure(result)) {
        return <ErrorMessage failure={result} />;
    }

    const employees = await employeesServer.all();

    if (isFailure(employees)) {
        return <ErrorMessage failure={employees} />;
    }

    const from = parse(parsedParams.data.from, "dd-MM-yyyy", new Date());
    const to = parse(parsedParams.data.to, "dd-MM-yyyy", new Date());

    let absences: AbsenceDaysList;
    try {
        absences = await timesheetsServer.absenceDaysAll({
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
                    message:
                        error instanceof Error ? error.message : String(error),
                }}
            />
        );
    }

    let absenceReasons: AbsenceReasonList;
    try {
        absenceReasons = await timesheetsServer.absenceReasonsAll();
    } catch (error) {
        console.error(error);
        return (
            <ErrorMessage
                failure={{
                    type: "__failure__",
                    code: "timesheets_absence_reasons_load_failed",
                    message:
                        error instanceof Error ? error.message : String(error),
                }}
            />
        );
    }

    let closures: ClosuresList;
    try {
        closures = await timesheetsServer.closuresAll();
    } catch (error) {
        console.error(error);
        return (
            <ErrorMessage
                failure={{
                    type: "__failure__",
                    code: "timesheets_closures_load_failed",
                    message:
                        error instanceof Error ? error.message : String(error),
                }}
            />
        );
    }

    const uniqueReasons: string[] = [];
    for (const absence of absences) {
        const reason = absence.absence_days?.reasonCode;

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
