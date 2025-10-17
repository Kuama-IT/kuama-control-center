import { ImportOrganizationsFromYouTrackButton } from "@/modules/clients/components/import-organizations-from-you-track-button";
import { ProjectsUpsertAllFromYouTrackButton } from "@/modules/projects/components/projects-upsert-all-from-you-track-button";
import { ImportAllSuppliersFromFattureInCloudButton } from "@/modules/suppliers/components/import-all-suppliers-from-fatture-in-cloud-button";
import { ImportReceivedInvoicesByDateFromFattureInCloudButton } from "@/modules/suppliers/components/import-received-invoices-by-date-from-fatture-in-cloud-button";
import { BrutalCard, BrutalContainer } from "@/modules/ui";
import { Title } from "@/modules/ui/components/title";

export function SuppliersSettings() {
    return (
        <BrutalContainer size="lg">
            <div className="space-y-6 py-10">
                <div className="flex items-center justify-between">
                    <Title>{"Suppliers · Imports"}</Title>
                </div>

                <BrutalCard className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="font-semibold text-lg">
                            {"Import suppliers from Fatture in Cloud"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {
                                "Upserts suppliers by Fatture In Cloud id and attaches VATs when available."
                            }
                        </p>
                    </div>
                    <ImportAllSuppliersFromFattureInCloudButton />
                </BrutalCard>

                <BrutalCard className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="font-semibold text-lg">
                            {"Import supplier invoices from Fatture In Cloud"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {
                                "Fetches received invoices from Fatture In Cloud for a given period and stores them."
                            }
                        </p>
                    </div>
                    <ImportReceivedInvoicesByDateFromFattureInCloudButton />
                </BrutalCard>
            </div>
        </BrutalContainer>
    );
}
