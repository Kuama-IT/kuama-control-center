import KClientsList from "@/modules/k-clients/components/k-clients-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | K1 App",
  description: "Clients | Kuama Control Center",
};

export default async function Page() {
  // TODO only admin
  return (
    <div className="max-w-screen-lg mx-auto">
      <KClientsList />
    </div>
  );
}
