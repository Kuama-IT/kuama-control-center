import KEmployees from "@/modules/k-employees/components/k-employee-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | K1 App",
  description: "Employees | Kuama Control Center",
};

export default async function Page() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <KEmployees />
    </div>
  );
}
