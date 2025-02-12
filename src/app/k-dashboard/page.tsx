import WeeklyAbsence from "@/modules/k-absence-days/components/weekly-absence";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <WeeklyAbsence />
      </Suspense>
    </div>
  );
}
