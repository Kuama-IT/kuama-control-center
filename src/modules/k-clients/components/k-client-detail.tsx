import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import Image from "next/image";
import { Suspense } from "react";
import KClientSpentTime from "@/modules/k-clients/components/k-client-spent-time";
import KClientReportedSpentTimeGraph from "@/modules/k-clients/components/k-client-reported-spent-time-graph";

import { KClientGetOneResult } from "@/modules/k-clients/actions/k-client-get-one-action";
import { BackButton } from "@/modules/ui/components/back-button";
import { KProject } from "@/modules/k-projects/components/k-project";
import KPlatformCredentialsList from "@/modules/k-platform-credentials/components/k-platform-credentials-list";
import { Skeleton } from "@/components/ui/skeleton";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function KClientDetail({ id }: { id: string }) {
  const client = await kClientsServer.getOne({ id });
  if (isFailure(client)) {
    return <ErrorMessage failure={client} />;
  }
  if (!client) {
    return <p>Client not found TODO manage error</p>;
  }
  return (
    <div className="">
      <div className="sticky top-0 w-full h-96 from-accent-foreground/20 to-accent overflow-hidden rounded-b-3xl bg-linear-to-tr">
        <InnerHeader client={client} />
        <Suspense fallback={<Skeleton className="absolute inset-0" />}>
          <KClientReportedSpentTimeGraph clientId={client.id!} />
        </Suspense>
      </div>

      <div className="bg-background relative z-10 flex flex-col gap-16">
        <div>
          {/*  TODO how on earth can id be undefined? */}
          <KPlatformCredentialsList
            showAddCredentials={true}
            clientId={client.id!}
          />
        </div>
        <div className="flex flex-col gap-8">
          {client.kProjects?.map((project) => (
            <KProject project={project} key={project.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

const InnerHeader = ({ client }: { client: KClientGetOneResult }) => {
  return (
    <div className="flex gap-4 items-center p-8 top-0 relative z-10">
      <BackButton />
      <Image
        src={client.avatarUrl!}
        alt={client.name!}
        width={100}
        height={100}
        className="rounded-full animate-fade-in-from-left"
      />
      <h2 className="text-2xl animate-fade-in-from-left stagger-animation-700">
        {client.name}
      </h2>
      <div className="flex-1"></div>
      <div className="aspect-square p-4 rounded bg-accent h-32 flex flex-col gap-4 items-center justify-center text-foreground animate-fade-in-from-left stagger-animation-900">
        <h3 className="text-3xl mono">{client.allTimeTasksCount}</h3>
        <p className="text-xs italic">All time tasks</p>
      </div>
      <div className="aspect-square p-4 rounded bg-accent h-32 flex flex-col gap-4 items-center justify-center text-foreground animate-fade-in-from-left  stagger-animation-900">
        <h3 className="text-3xl mono">{client.kProjects?.length ?? 0}</h3>
        <p className="text-xs italic">projects</p>
      </div>
      <div className=" p-4 rounded bg-accent h-32 flex flex-col gap-4 items-center justify-center text-foreground animate-fade-in-from-left  stagger-animation-900">
        <Suspense fallback={"loading client month spent time total"}>
          <KClientSpentTime
            className="text-3xl mono"
            date={new Date()}
            projectIds={client.kProjects?.map((it) => it.id) ?? []}
          />
        </Suspense>
        <p className="text-xs italic">Monthly reported spent time</p>
      </div>
    </div>
  );
};
