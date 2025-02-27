import { HiArrowSmRight } from "react-icons/hi";
import Image from "next/image";
import { KClientListItem } from "@/modules/k-clients/k-clients-server";
import Link from "next/link";
import { CSSProperties, Suspense } from "react";
import KClientReportedSpentTimeGraph from "@/modules/k-clients/components/k-client-reported-spent-time-graph";
import { routes } from "@/modules/ui/routes";
import KClientInvoicedAmount from "@/modules/k-clients/components/k-client-invoiced-amount";
import { auth } from "@/modules/auth/auth";

type Props = {
  client: KClientListItem;
  index?: number;
};
export const KClientCard = async ({ client, index = 0 }: Props) => {
  const style = {
    "--animation-duration": `${0.3 + index}s`,
  } as CSSProperties;
  const session = await auth();
  return (
    <Link href={routes.client(client.id)} className="cursor-pointer">
      <div className="flex items-center relative group">
        <div
          style={style}
          className={`rounded-xl p-8 shadow-lg flex flex-col gap-4 transition-all hover:shadow-xl hover:translate-x-1.5 animate-fade-in-from-left stagger-animation-100 bg-background/15 flex-1 relative`}
        >
          <Suspense>
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <KClientReportedSpentTimeGraph clientId={client.id} />
            </div>
          </Suspense>
          <div className="flex gap-4 items-center">
            <div className="rounded-full w-[50px] h-[50px] relative overflow-hidden bg-white flex items-center justify-center">
              <Image
                src={client.avatarUrl!}
                alt={client.name!}
                height={100}
                width={100}
              />
            </div>
            <h2 className="text-xl">{client.name}</h2>
          </div>
          <p>{client.projectsCount} projects</p>
          <p>{client.employeesWorkingForClientCount} employees involved</p>
          {/*{session?.user?.isAdmin && (*/}
          {/*  <Suspense>*/}
          {/*    <KClientInvoicedAmount clientId={client.id} />*/}
          {/*  </Suspense>*/}
          {/*)}*/}
        </div>
        <HiArrowSmRight className="pointer-events-none absolute right-0 opacity-0 text-2xl text-gray-300 group-hover:opacity-100 group-hover:right-4 transition-all" />
      </div>
    </Link>
  );
};
