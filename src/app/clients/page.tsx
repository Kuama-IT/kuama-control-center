import KClientsList from "@/modules/k-clients/components/k-clients-list";
import type { Metadata } from "next";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";

export const metadata: Metadata = {
  title: "Clients | K1 App",
  description: "Clients | Kuama Control Center",
};

async function Page() {
  return (
    <div className="max-w-(--breakpoint-lg) mx-auto">
      <KClientsList />
    </div>
  );
}

export default async function () {
  return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
