import Link from "next/link";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { ImportClientsFromDicButton } from "@/modules/clients/components/import-clients-from-dic-button";
import { ImportOrganizationsFromYouTrackButton } from "@/modules/clients/components/import-organizations-from-you-track-button";
import { ProjectsUpsertAllFromYouTrackButton } from "@/modules/projects/components/projects-upsert-all-from-you-track-button";
import { BrutalCard, BrutalContainer, brutalTheme } from "@/modules/ui";

async function Page() {
    return (
        <BrutalContainer size="lg">
            <div className="space-y-6 py-10">
                <div className="flex items-center justify-between">
                    <h1 className={brutalTheme.typography.heading}>
                        {"Clients · Imports"}
                    </h1>
                    <Link
                        href="/clients/settings/mappings"
                        className="text-sm underline"
                    >
                        {"Go to Mappings"}
                    </Link>
                </div>

                <BrutalCard className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="font-semibold text-lg">
                            {"Import clients from Fatture in Cloud"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {
                                "Upserts clients by name and attaches VATs when available."
                            }
                        </p>
                    </div>
                    <ImportClientsFromDicButton />
                </BrutalCard>

                <BrutalCard className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="font-semibold text-lg">
                            {"Import organizations from YouTrack"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {
                                "Fetches organizations from YouTrack and rebuilds the local list."
                            }
                        </p>
                    </div>
                    <ImportOrganizationsFromYouTrackButton />
                </BrutalCard>

                <BrutalCard className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="font-semibold text-lg">
                            {"Import projects from YouTrack"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {
                                "Fetches projects from YouTrack and rebuilds the local list."
                            }
                        </p>
                    </div>
                    <ProjectsUpsertAllFromYouTrackButton />
                </BrutalCard>
            </div>
        </BrutalContainer>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic";
