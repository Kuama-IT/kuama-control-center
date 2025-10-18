import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { clientsServer } from "@/modules/clients/clients.server";
import { Project } from "@/modules/projects/components/project";
import { BackButton } from "@/modules/ui/components/back-button";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";
import ClientReportedSpentTimeGraph from "./client-reported-spent-time-graph";
import ClientSpentTime from "./client-spent-time";

export default async function ClientDetail({ id }: { id: string }) {
    const client = await clientsServer.getOne({ id });
    if (isFailure(client)) {
        return <ErrorMessage failure={client} />;
    }

    return (
        <div className="">
            <div className="sticky top-0 h-96 w-full overflow-hidden rounded-b-3xl bg-linear-to-tr from-accent-foreground/20 to-accent">
                <InnerHeader client={client} />
                <Suspense fallback={<Skeleton className="absolute inset-0" />}>
                    <ClientReportedSpentTimeGraph clientId={client.id} />
                </Suspense>
            </div>

            <div className="relative z-10 flex flex-col gap-16 bg-background">
                <div className="flex flex-col gap-8">
                    {client.projects?.map((project) => (
                        <Project project={project} key={project.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const InnerHeader = ({
    client,
}: {
    client: Awaited<ReturnType<typeof clientsServer.getOne>> extends infer R
        ? R extends { type: "__failure__" }
            ? never
            : R
        : never;
}) => {
    return (
        <div className="relative top-0 z-10 flex items-center gap-4 p-8">
            <BackButton />
            <Image
                src={client.avatarUrl ?? "/youtrack-logo.svg"}
                alt={client.name!}
                width={100}
                height={100}
                className="animate-fade-in-from-left rounded-full"
            />
            <h2 className="stagger-animation-700 animate-fade-in-from-left text-2xl">
                {client.name}
            </h2>
            <div className="flex-1"></div>
            <div className="stagger-animation-900 flex aspect-square h-32 animate-fade-in-from-left flex-col items-center justify-center gap-4 rounded bg-accent p-4 text-foreground">
                <h3 className="mono text-3xl">{client.allTimeTasksCount}</h3>
                <p className="text-xs italic">All time tasks</p>
            </div>
            <div className="stagger-animation-900 flex aspect-square h-32 animate-fade-in-from-left flex-col items-center justify-center gap-4 rounded bg-accent p-4 text-foreground">
                <h3 className="mono text-3xl">
                    {client.projects?.length ?? 0}
                </h3>
                <p className="text-xs italic">projects</p>
            </div>
            <div className="stagger-animation-900 flex h-32 animate-fade-in-from-left flex-col items-center justify-center gap-4 rounded bg-accent p-4 text-foreground">
                <Suspense fallback={"loading client month spent time total"}>
                    <ClientSpentTime
                        className="mono text-3xl"
                        date={new Date()}
                        projectIds={client.projects?.map((it) => it.id) ?? []}
                    />
                </Suspense>
                <p className="text-xs italic">Monthly reported spent time</p>
            </div>
        </div>
    );
};
