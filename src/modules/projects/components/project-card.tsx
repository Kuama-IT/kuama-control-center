import Link from "next/link";
import { type CSSProperties, Suspense } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import ClientSpentTime from "@/modules/clients/components/client-spent-time";
import { type ProjectRead } from "@/modules/projects/schemas/projects.read.schema";
import { routes } from "@/modules/ui/routes";

type MinimalClient = { id: number; name: string };
type Props = {
    project: ProjectRead & { client: MinimalClient };
    index?: number;
};

export const ProjectCard = ({ project, index = 0 }: Props) => {
    const style = {
        "--animation-duration": `${0.3 + index}s`,
    } as CSSProperties;
    return (
        <Link href={routes.client(project.clientId)} className="cursor-pointer">
            <div className="group relative flex items-center">
                <div
                    style={style}
                    className={`stagger-animation-100 relative flex flex-1 animate-fade-in-from-left flex-col gap-4 rounded-xl bg-background/15 p-8 shadow-lg transition-all hover:translate-x-1.5 hover:shadow-xl`}
                >
                    <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded bg-black text-white uppercase">
                            {project.name?.at(0)}
                        </span>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl">{project.name}</h2>
                            <p>{project.client.name}</p>
                            <Suspense>
                                <div className="pointer-events-none absolute inset-0 opacity-50">
                                    {/* todo ProjectReportedSpentTimeGraph */}
                                    <ClientSpentTime
                                        className="text-sm"
                                        date={new Date()}
                                        projectIds={[project.id]}
                                    />
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
                <HiArrowSmRight className="pointer-events-none absolute right-0 text-2xl text-gray-300 opacity-0 transition-all group-hover:right-4 group-hover:opacity-100" />
            </div>
        </Link>
    );
};
