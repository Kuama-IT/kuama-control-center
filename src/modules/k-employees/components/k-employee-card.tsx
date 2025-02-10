import { KEmployeesRead } from "@/drizzle/drizzle-types";
import { CSSProperties, Suspense } from "react";
import Link from "next/link";
import { routes } from "@/app/routes";
import KClientReportedSpentTimeGraph from "@/modules/k-clients/components/k-client-reported-spent-time-graph";
import Image from "next/image";
import { HiArrowSmRight } from "react-icons/hi";
// TODO add some nice stats
export const KEmployeeCard = ({
  employee,
  index,
}: {
  employee: KEmployeesRead;
  index: number;
}) => {
  const style = {
    "--animation-duration": `${0.3 + index}s`,
  } as CSSProperties;

  return (
    <Link href={routes.employee(employee.id)} className="cursor-pointer">
      <div className="flex items-center relative group">
        <div
          style={style}
          className={`rounded-xl p-8 shadow-lg flex flex-col gap-4 transition-all hover:shadow-xl hover:translate-x-1.5 animate-fade-in-from-left stagger-animation-100 bg-background/15 flex-1 relative`}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full w-[50px] h-[50px] relative overflow-hidden bg-white flex items-center justify-center">
              {employee.avatarUrl && employee.fullName && (
                <Image
                  src={employee.avatarUrl}
                  alt={employee.fullName}
                  height={100}
                  width={100}
                />
              )}
            </div>
            <h2 className="text-xl">{employee.fullName}</h2>
          </div>
          <p>{employee.email}</p>
          <p>{employee.birthdate} </p>
        </div>
        <HiArrowSmRight className="pointer-events-none absolute right-0 opacity-0 text-2xl text-gray-300 group-hover:opacity-100 group-hover:right-4 transition-all" />
      </div>
    </Link>
  );
};
