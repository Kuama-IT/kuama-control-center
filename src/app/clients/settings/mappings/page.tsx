import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { clientsServer } from "@/modules/clients/clients.server";
import { LinkClientOrganizationCard } from "@/modules/clients/components/link-client-organization-card";
import { BrutalContainer, brutalTheme } from "@/modules/ui";

async function Page() {
    const unlinkedClients = await clientsServer.allUnlinkedExtended();

    const allOrganizations = await clientsServer.allOrganizations();

    return (
        <BrutalContainer size="lg">
            <div className="space-y-6 py-10">
                <div className="flex items-center justify-between">
                    <h1 className={brutalTheme.typography.heading}>
                        {"Clients · YT Organizations Mappings"}
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    {
                        "Note: a YouTrack organization can be linked to multiple clients."
                    }
                </p>

                <div className="space-y-4">
                    {unlinkedClients.length === 0 && (
                        <p className="text-muted-foreground">
                            {
                                "All clients are linked to at least one organization."
                            }
                        </p>
                    )}
                    {unlinkedClients.map((client) => {
                        return (
                            <LinkClientOrganizationCard
                                key={client.id}
                                organizations={allOrganizations}
                                client={client}
                            />
                        );
                    })}
                </div>
            </div>
        </BrutalContainer>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic";
