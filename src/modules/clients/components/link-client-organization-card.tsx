"use client";
import { OrganizationRead } from "@/modules/you-track/schemas/organization-read";
import { ClientReadExtended } from "@/modules/clients/schemas/client-read-extended";
import { BrutalCard } from "@/modules/ui";
import { LinkOrganizationToClientButton } from "@/modules/clients/components/link-organization-to-client-button";
import { ManualLinkOrganizationToClient } from "@/modules/clients/components/manual-link-organization-to-client";
import { useClientOrganizationSuggestionsQuery } from "@/modules/clients/queries/clients.queries";
import { UnlinkOrganizationFromClientButton } from "@/modules/clients/components/unlink-organization-from-client-button";

type Props = {
  organizations: OrganizationRead[];
  client: ClientReadExtended;
};

export function LinkClientOrganizationCard(props: Props) {
  const { organizations, client } = props;
  const query = useClientOrganizationSuggestionsQuery(client.id);

  const suggestedOrganizations = query.data ?? [];
  return (
    <BrutalCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">{client.name}</div>
      </div>
      <div className="text-sm text-muted-foreground">
        {query.isLoading ? "Loading matches..." : "Suggested matches"}
      </div>
      {client.organization && (
        <UnlinkOrganizationFromClientButton
          clientId={client.id}
          organization={client.organization}
        />
      )}
      <div className="flex gap-2 flex-wrap">
        {suggestedOrganizations.length > 0 &&
          suggestedOrganizations.map((organization) => (
            <LinkOrganizationToClientButton
              key={organization.id}
              clientName={organization.name}
              score={organization.score}
              clientId={client.id}
              organizationId={organization.id}
            />
          ))}
      </div>
      {!query.isLoading && suggestedOrganizations.length === 0 && (
        <span className="text-xs text-muted-foreground">
          No suggestions ≥ 20%
        </span>
      )}
      <ManualLinkOrganizationToClient
        clientId={client.id}
        organizations={organizations.filter(
          (o) => o.id !== client.organizationId,
        )}
      />
    </BrutalCard>
  );
}
