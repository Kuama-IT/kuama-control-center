import Link from "next/link";
import { type CSSProperties } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { EmployeeAvatar } from "@/modules/employees/components/employee-avatar";
import { EmployeeQuotas } from "@/modules/employees/components/employee-quotas";
import { type EmployeeReadExtended } from "@/modules/employees/schemas/employee-read-extended";
import { brutalTheme } from "@/modules/ui/brutal-theme";
import { routes } from "@/modules/ui/routes";

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
                className={`group relative flex items-center ${brutalTheme.base.sharp}`}
            >
                <div
                    style={style}
                    className={`flex flex-col gap-4 ${brutalTheme.spacing.card} ${brutalTheme.borders.thick} ${brutalTheme.shadows.lg} ${brutalTheme.transitions.normal} relative flex-1 bg-white ${brutalTheme.base.sharp} hover:${brutalTheme.shadows.xl}`}
                >
                    <div className="flex items-center gap-4">
                        <EmployeeAvatar
                            avatarUrl={employee.avatarUrl}
                            fullName={employee.fullName}
                            size={50}
                        />
                        <h2 className={brutalTheme.typography.body}>
                            {employee.fullName}
                        </h2>
                    </div>
                    <p className={brutalTheme.typography.body}>
                        {employee.email}
                    </p>
                    <p className={brutalTheme.typography.caption}>
                        {employee.birthdate?.toLocaleString()}
                    </p>
                    <EmployeeQuotas employee={employee} />
                </div>
                <HiArrowSmRight className="pointer-events-none absolute right-0 text-2xl text-gray-300 opacity-0 transition-all group-hover:right-4 group-hover:opacity-100" />
            </div>
        </Link>
    );
};
