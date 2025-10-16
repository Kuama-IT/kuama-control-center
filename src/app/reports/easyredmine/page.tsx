import { parse } from "date-fns";
import { z } from "zod";
import { accessTokensServer } from "@/modules/access-tokens/access-tokens.server";
import EasyredmineReport from "@/modules/easyredmine/components/easyredmine-report";
import {
    accessTokenParamsSchema,
    datePeriodParamsSchema,
    type PageParams,
} from "@/modules/routing/schemas/routing-schemas";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";

const paramsSchema = datePeriodParamsSchema.and(accessTokenParamsSchema).and(
    z.object({
        credentialsId: z.string(),
    }),
);

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

    const from = parse(parsedParams.data.from, "dd-MM-yyyy", new Date());
    const to = parse(parsedParams.data.to, "dd-MM-yyyy", new Date());

    return (
        <EasyredmineReport
            from={from}
            to={to}
            credentialsId={parsedParams.data.credentialsId}
        />
    );
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
