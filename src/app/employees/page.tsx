import type { Metadata } from "next";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import EmployeeList from "@/modules/employees/components/employee-list";

export const metadata: Metadata = {
    title: "EmployeeList | K1 App",
    description: "EmployeeList | Kuama Control Center",
};

async function Page() {
    return (
        <div className="max-w-(--breakpoint-lg) mx-auto pt-4">
            <EmployeeList />
        </div>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
