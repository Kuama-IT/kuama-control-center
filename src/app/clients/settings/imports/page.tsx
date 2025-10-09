import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { ImportClientsFromDicButton } from "@/modules/clients/components/import-clients-from-dic-button";
import { BrutalCard, BrutalContainer, brutalTheme } from "@/modules/ui";
import { YtImportOrganizationsButton } from "@/modules/you-track/components/yt-import-organizations-button";
import Link from "next/link";

async function Page() {
    return (
    <BrutalContainer size="lg">
      <div className="py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className={brutalTheme.typography.heading}>Clients · Imports</h1>
          <Link href="/clients/settings/mappings" className="text-sm underline">
            Go to Mappings
          </Link>
        </div>

        <BrutalCard className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Import clients from Fatture in Cloud</h2>
            <p className="text-sm text-muted-foreground">
              Upserts clients by name and attaches VATs when available.
            </p>
          </div>
          <ImportClientsFromDicButton />
        </BrutalCard>

        <BrutalCard className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Import organizations from YouTrack</h2>
            <p className="text-sm text-muted-foreground">
              Fetches organizations from YouTrack and rebuilds the local list.
            </p>
          </div>
          <YtImportOrganizationsButton />
        </BrutalCard>
      </div>
    </BrutalContainer>
  );
}

export default async function () {
  return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic";
