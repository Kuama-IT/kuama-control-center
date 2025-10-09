import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiArrowSmRight } from "react-icons/hi";
import { routes } from "@/modules/ui/routes";
import { EmployeesRead } from "@/modules/employees/schemas/employees-read";
import { brutalTheme } from "@/modules/ui/brutal-theme";

export const EmployeeCard = ({
  employee,
  index,
}: {
  employee: EmployeesRead;
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
            <div
              className={`w-[50px] h-[50px] relative overflow-hidden bg-white flex items-center justify-center`}
            >
              {employee.avatarUrl && employee.fullName && (
                <Image
                  src={employee.avatarUrl}
                  alt={employee.fullName}
                  height={100}
                  width={100}
                />
              )}
            </div>
            <h2 className={brutalTheme.typography.body}>{employee.fullName}</h2>
          </div>
          <p className={brutalTheme.typography.body}>{employee.email}</p>
          <p className={brutalTheme.typography.caption}>
            {employee.birthdate.toLocaleString()}
          </p>
        </div>
        <HiArrowSmRight className="pointer-events-none absolute right-0 opacity-0 text-2xl text-gray-300 group-hover:opacity-100 group-hover:right-4 transition-all" />
      </div>
    </Link>
  );
};
