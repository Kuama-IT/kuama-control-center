import { CSSProperties } from "react";
import Link from "next/link";
import { HiArrowSmRight } from "react-icons/hi";
import { routes } from "@/modules/ui/routes";
import { brutalTheme } from "@/modules/ui/brutal-theme";
import { EmployeeReadExtended } from "@/modules/employees/schemas/employee-read-extended";
import { EmployeeAvatar } from "@/modules/employees/components/employee-avatar";
import { EmployeeQuotas } from "@/modules/employees/components/employee-quotas";

export const EmployeeCard = ({
  employee,
  index,
}: {
  employee: EmployeeReadExtended;
  index: number;
}) => {
  const style = {
    "--animation-duration": `${0.3 + index}s`,
  } as CSSProperties;

  return (
    <Link
      href={routes.employee(employee.id)}
      className={brutalTheme.base.interactive}
    >
      <div
        className={`flex items-center relative group ${brutalTheme.base.sharp}`}
      >
        <div
          style={style}
          className={`flex flex-col gap-4 ${brutalTheme.spacing.card} ${brutalTheme.borders.thick} ${brutalTheme.shadows.lg} ${brutalTheme.transitions.normal} bg-white flex-1 relative ${brutalTheme.base.sharp} hover:${brutalTheme.shadows.xl}`}
        >
          <div className="flex gap-4 items-center">
            <EmployeeAvatar
              avatarUrl={employee.avatarUrl}
              fullName={employee.fullName}
              size={50}
            />
            <h2 className={brutalTheme.typography.body}>{employee.fullName}</h2>
          </div>
          <p className={brutalTheme.typography.body}>{employee.email}</p>
          <p className={brutalTheme.typography.caption}>
            {employee.birthdate?.toLocaleString()}
          </p>
          <EmployeeQuotas employee={employee} />
        </div>
        <HiArrowSmRight className="pointer-events-none absolute right-0 opacity-0 text-2xl text-gray-300 group-hover:opacity-100 group-hover:right-4 transition-all" />
      </div>
    </Link>
  );
};
