import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { clientsServer } from "@/modules/clients/clients.server";
import { AutolinkClientsAndOrganizationsButton } from "@/modules/clients/components/autolink-clients-and-organizations-button";
import { LinkOrganizationToClientButton } from "@/modules/clients/components/link-organization-to-client-button";
import { UnlinkOrganizationFromClientButton } from "@/modules/clients/components/unlink-organization-from-client-button";
import { ManualLinkOrganizationToClient } from "@/modules/clients/components/manual-link-organization-to-client";
import {
    BrutalCard,
    BrutalContainer,
    brutalTheme
} from "@/modules/ui";
import { isFailure } from "@/utils/server-action-utils";


async function Page() {
  const unlinked = await clientsServer.listUnlinked();
  if (isFailure(unlinked)) {
    return <pre className="text-red-600">{unlinked.message}</pre>;
  }

  const suggestions = await clientsServer.suggestYouTrackOrgMatches({ minScore: 0.2 });
  if (isFailure(suggestions)) {
    return <pre className="text-red-600">{suggestions.message}</pre>;
  }
  const allClients = await clientsServer.listAllBasic();

  const suggestionsByOrg = new Map<number, typeof suggestions[number]>();
  for (const s of suggestions) {suggestionsByOrg.set(s.organizationId, s);}

  return (
    <BrutalContainer size="lg">
      <div className="py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className={brutalTheme.typography.heading}>Clients · Mappings</h1>
          <AutolinkClientsAndOrganizationsButton />
        </div>
        <p className="text-sm text-muted-foreground">
          Note: a client can be linked to multiple YouTrack organizations.
        </p>

        <div className="space-y-4">
          {unlinked.length === 0 ? (
            <p className="text-muted-foreground">All organizations are linked.</p>
          ) : (
            unlinked.map((org) => {
              const s = suggestionsByOrg.get(org.id);
              const hasCandidates = !!s && s.candidates.length > 0;
              return (
                <BrutalCard key={org.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{org.name}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Suggested matches</div>
                  <div className="flex gap-2 flex-wrap">
                    {hasCandidates && (
                      s.candidates.map((c) => (
                        <LinkOrganizationToClientButton key={c.clientId} clientName={c.clientName} score={c.score} clientId={c.clientId} organizationId={org.id} />
                      ))
                    )}
                    <div className="flex flex-col gap-2">
                        {!hasCandidates && (
                          <span className="text-xs text-muted-foreground">No suggestions ≥ 60%</span>
                        )}
                        <ManualLinkOrganizationToClient
                          organizationId={org.id}
                          clients={allClients.map((c) => ({ id: c.id!, name: c.name }))}
                        />
                      </div>
                  </div>
                </BrutalCard>
              );
            })
          )}
        </div>
      </div>
    </BrutalContainer>
  );
}

export default async function () {
  return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic";
