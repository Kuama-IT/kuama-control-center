import { Suspense } from "react";
import KClientsList from "@/modules/k-clients/components/k-clients-list";

export default async function Page() {
  return (
    <Suspense>
      <div className="max-w-screen-lg mx-auto">
        <KClientsList />
      </div>
    </Suspense>
  );
}
