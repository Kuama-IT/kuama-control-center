import WeeklyAbsence from "@/modules/k-absence-days/components/weekly-absence";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";

async function Page() {
  return (
    <div className="pt-4 px-4">
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}>
        <WeeklyAbsence />
      </Suspense>
    </div>
  );
}

export default async function () {
  return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
