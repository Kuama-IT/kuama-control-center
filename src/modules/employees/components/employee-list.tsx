import { Title } from "@/modules/ui/components/title";
import { employeesServer } from "@/modules/employees/employees.server";
import { EmployeeCard } from "@/modules/employees/components/employee-card";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { BrutalSeparator, brutalTheme } from "@/modules/ui";
import Link from "next/link";
import { ReceiptEuro, SettingsIcon } from "lucide-react";

export default async function EmployeeList() {
  const employees = await employeesServer.allExtended();

  return (
    <>
      <div className="flex items-center justify-between">
        <Title>Employees ({employees.length})</Title>

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

      <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-3 py-8 items-center">
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
