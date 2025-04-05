import KEmployees from "@/modules/k-employees/components/k-employee-list";
import type { Metadata } from "next";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";

export const metadata: Metadata = {
  title: "Employees | K1 App",
  description: "Employees | Kuama Control Center",
};

async function Page() {
  return (
    <div className="max-w-(--breakpoint-lg) mx-auto pt-4">
      <KEmployees />
    </div>
  );
}

export default async function () {
  return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
