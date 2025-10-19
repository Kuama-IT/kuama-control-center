import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, Suspense } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { auth } from "@/modules/auth/auth";
import { BrutalCard } from "@/modules/ui/components/brutal-layout";
import { routes } from "@/modules/ui/routes";
import { type OrganizationRead } from "@/modules/you-track/schemas/organization-read";

type Props = {
    client: OrganizationRead;
    index?: number;
};

export default async function ClientCard({ client, index = 0 }: Props) {
    const style = {
        "--animation-duration": `${0.3 + index}s`,
    } as CSSProperties;
    const session = await auth();
    return (
        <Link href={routes.client(client.id)} className="cursor-pointer">
            <div className="group relative flex items-center">
                <BrutalCard
                    className="relative flex flex-1 flex-col gap-4 p-8"
                    style={style}
                >
                    <Suspense>
                        <div className="pointer-events-none absolute inset-0 opacity-50">
                            {/*<ClientReportedSpentTimeGraph clientId={client.id} />*/}
                        </div>
                    </Suspense>
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-white">
                            <Image
                                src={client.avatarUrl ?? "/youtrack-logo.svg"}
                                alt={client.name}
                                height={100}
                                width={100}
                            />
                        </div>
                        <h2 className="text-xl">{client.name}</h2>
                    </div>
                    {/*<p>{client.projectsCount} projects</p>*/}
                    {/*<p>{client.employeesWorkingForClientCount} employees involved</p>*/}
                    {session?.user?.isAdmin && (
                        <Suspense>
                            {/*<ClientInvoicedAmount clientId={client.id} />*/}
                        </Suspense>
                    )}
                </BrutalCard>
                <HiArrowSmRight className="pointer-events-none absolute right-0 text-2xl text-gray-300 opacity-0 transition-all group-hover:right-4 group-hover:opacity-100" />
            </div>
        </Link>
    );
}
