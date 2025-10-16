import { endOfMonth, parse, startOfMonth, subMonths } from "date-fns";
import { EmittedInvoicesImport } from "@/modules/cash-flow/components/emitted-invoices-import";
import {
    datePeriodParamsSchema,
    type PageParams,
} from "@/modules/routing/schemas/routing-schemas";

export default async function Page({ searchParams }: PageParams) {
    const parsedParams = datePeriodParamsSchema.safeParse(await searchParams);

    let from: Date;
    let to: Date;

    if (!parsedParams.success) {
        // Default to previous month range if parameters are not provided or invalid
        const now = new Date();
        const previousMonth = subMonths(now, 1);
        from = startOfMonth(previousMonth);
        to = endOfMonth(previousMonth);
    } else {
        // Parse the from and to dates from the URL parameters
        from = parse(parsedParams.data.from, "dd-MM-yyyy", new Date());
        to = parse(parsedParams.data.to, "dd-MM-yyyy", new Date());
    }

    return <EmittedInvoicesImport from={from} to={to} />;
}
