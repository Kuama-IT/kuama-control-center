import { ReceiptEuro, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { EmployeeCard } from "@/modules/employees/components/employee-card";
import { employeesServer } from "@/modules/employees/employees.server";
import { BrutalSeparator, brutalTheme } from "@/modules/ui";
import { Title } from "@/modules/ui/components/title";

export default async function EmployeeList() {
    const employees = await employeesServer.allExtended();

    return (
        <>
            <div className="flex items-center justify-between">
                <Title>{`Employees (${employees.length})`}</Title>

                <div className="flex items-center gap-4">
                    <Link
                        href="/employees/payslips"
                        className={brutalTheme.typography.caption}
                    >
                        <ReceiptEuro />
                    </Link>
                    <Link
                        href="/employees/settings/imports"
                        className={brutalTheme.typography.caption}
                    >
                        <SettingsIcon />
                    </Link>
                </div>
            </div>

            <BrutalSeparator />

            <div className="grid items-center gap-12 py-8 sm:grid-cols-1 md:grid-cols-3">
                {employees.map((employee, index) => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        index={index / 10}
                    />
                ))}
            </div>
        </>
    );
}
