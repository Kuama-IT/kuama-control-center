import { KProjectsRead } from "@/drizzle/drizzle-types";
import { CSSProperties, Suspense } from "react";
import Link from "next/link";
import { routes } from "@/modules/ui/routes";
import { HiArrowSmRight } from "react-icons/hi";
import KClientSpentTime from "@/modules/k-clients/components/k-client-spent-time";

type Props = {
  project: KProjectsRead & {
    kClient: {
      id: number;
      name: string;
      youTrackRingId: string | null;
    };
  };
  index?: number;
};
export const KProjectCard = ({ project, index = 0 }: Props) => {
  const style = {
    "--animation-duration": `${0.3 + index}s`,
  } as CSSProperties;
  return (
    <Link href={routes.client(project.clientId)} className="cursor-pointer">
      <div className="flex items-center relative group">
        <div
          style={style}
          className={`rounded-xl p-8 shadow-lg flex flex-col gap-4 transition-all hover:shadow-xl hover:translate-x-1.5 animate-fade-in-from-left stagger-animation-100 bg-background/15 flex-1 relative`}
        >
          <div className="flex gap-4 items-center">
            <span className="flex items-center justify-center h-10 w-10 rounded bg-black text-white uppercase">
              {project.name?.at(0)}
            </span>
            <div className="flex gap-2 flex-col">
              <h2 className="text-xl">{project.name}</h2>
              <p>{project.kClient.name}</p>
              <Suspense>
                {/*<div className="absolute inset-0 opacity-50 pointer-events-none">*/}
                {/* todo KProjectReportedSpentTimeGraph */}
                <KClientSpentTime
                  className="text-sm"
                  date={new Date()}
                  projectIds={[project.id]}
                />
                {/*</div>*/}
              </Suspense>
            </div>
          </div>
        </div>
        <HiArrowSmRight className="pointer-events-none absolute right-0 opacity-0 text-2xl text-gray-300 group-hover:opacity-100 group-hover:right-4 transition-all" />
      </div>
    </Link>
  );
};
