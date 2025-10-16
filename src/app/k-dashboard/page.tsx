import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { CashFlowImports } from "@/modules/cash-flow/components/cash-flow-imports";
import WeeklyAbsence from "@/modules/timesheets/components/weekly-absence";

async function Page() {
    return (
        <div className="px-4 pt-4">
            <CashFlowImports />
            <Suspense
                fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}
            >
                <WeeklyAbsence />
            </Suspense>
        </div>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
