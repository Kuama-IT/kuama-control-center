import type { Metadata } from "next";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import EmployeeList from "@/modules/employees/components/employee-list";
import { EmployeesWithPayslips } from "@/modules/employees/components/employees-with-payslips";
import { employeesServer } from "@/modules/employees/employees.server";

export const metadata: Metadata = {
    title: "Employee Payslips Overview | K1 App",
    description: '"Employee Payslips Overview | Kuama Control Center',
};

async function Page() {
    const employees = await employeesServer.allExtended();
    return (
        <div className="mx-16 pt-4">
            <EmployeesWithPayslips employees={employees} />
        </div>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
