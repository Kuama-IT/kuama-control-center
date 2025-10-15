import WeeklyAbsence from "@/modules/timesheets/components/weekly-absence";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
// import PubblicaWebFolders from "@/modules/pubblica-web/components/pubblica-web-folders";

import { CashFlowImports } from "@/modules/cash-flow/components/cash-flow-imports";

async function Page() {
    return (
        <div className="pt-4 px-4">
            <CashFlowImports />
            <Suspense
                fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}
            >
                <WeeklyAbsence />
            </Suspense>
            {/*<PubblicaWebFolders />*/}
        </div>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
