import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { clientsServer } from "@/modules/clients/clients.server";

import { BrutalContainer, brutalTheme } from "@/modules/ui";
import { LinkClientOrganizationCard } from "@/modules/clients/components/link-client-organization-card";

async function Page() {
  const unlinkedClients = await clientsServer.allUnlinked();
  //
  // const suggestions = await clientsServer.suggestYouTrackOrgMatches({
  //   minScore: 0.2,
  // });

  const allClients = await clientsServer.allExtended();
  const allOrganizations = await clientsServer.allOrganizations();

  // const suggestionsByOrg = new Map<number, (typeof suggestions)[number]>();
  // for (const s of suggestions) {
  //   suggestionsByOrg.set(s.organizationId, s);
  // }

  return (
    <BrutalContainer size="lg">
      <div className="py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className={brutalTheme.typography.heading}>
            Clients · YT Organizations Mappings
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Note: a YouTrack organization can be linked to multiple clients.
        </p>

        <div className="space-y-4">
          {unlinkedClients.length === 0 && (
            <p className="text-muted-foreground">
              All clients are linked to at least one organization .
            </p>
          )}
          {allClients.map((client) => {
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
