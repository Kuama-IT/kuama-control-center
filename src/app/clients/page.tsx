import { type Metadata } from "next";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import ClientsList from "@/modules/clients/components/clients-list";

export const metadata: Metadata = {
    title: "Clients | K1 App",
    description: "Clients | Kuama Control Center",
};

async function Page() {
    return (
        <div className="mx-auto max-w-(--breakpoint-lg)">
            <ClientsList />
        </div>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
