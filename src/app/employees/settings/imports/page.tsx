import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { BrutalCard, BrutalContainer, brutalTheme } from "@/modules/ui";
import Link from "next/link";
import { ImportEmployeesButton } from "@/modules/employees/components/import-employees-button";
import { ImportPubblicaWebPayslipsButton } from "@/modules/payslips/components/import-pubblica-web-payslips-button";
import { ReparsePubblicaWebPayslipsButton } from "@/modules/pubblica-web/components/reparse-pubblica-web-payslips-button";
import { StoreAllPubblicaWebMonthlyBalancesButton } from "@/modules/pubblica-web/components/store-all-pubblica-web-monthly-balances-button";
import { ParseAllPubblicaWebMonthlyBalancesButton } from "@/modules/pubblica-web/components/parse-all-pubblica-web-monthly-balances-button";
import { StoreAllPubblicaWebPayslipSourceFilesButton } from "@/modules/pubblica-web/components/store-all-pubblica-web-payslip-source-files-button";
import { ParseAndCreateMissingPubblicaWebPayslipsButton } from "@/modules/pubblica-web/components/pubblica-web-parse-and-create-missing-payslips-button";
import SyncTimesheets from "@/modules/timesheets/components/sync-timesheets";

async function Page() {
    const heading = (
        <div className="flex items-center justify-between">
            <h1 className={brutalTheme.typography.heading}>
                Employees · Imports
            </h1>
            <Link href="/employees" className={brutalTheme.typography.caption}>
                Back to Employees
            </Link>
        </div>
    );

    return (
        <BrutalContainer size="lg">
            <div className="py-10 space-y-6">
                {heading}

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    <BrutalCard className="space-y-3">
                        <h2 className={brutalTheme.typography.subheading}>
                            Import from Dipendenti in Cloud
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Fetch active employees from Dipendenti in Cloud and
                            upsert them in the local database.
                        </p>
                        <ImportEmployeesButton />
                    </BrutalCard>

                    <BrutalCard className="space-y-3">
                        <h2 className={brutalTheme.typography.subheading}>
                            Pubblica Web Monthly balances
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Fetch all available monthly balance (from 2021 to
                            current) from Pubblica Web and store them.
                        </p>
                        <StoreAllPubblicaWebMonthlyBalancesButton />
                        <p className="text-sm text-muted-foreground">
                            Parse all available monthly balance from Pubblica
                            Web.
                        </p>
                        <ParseAllPubblicaWebMonthlyBalancesButton />
                    </BrutalCard>

                    <BrutalCard className="space-y-3">
                        <h2 className={brutalTheme.typography.subheading}>
                            Pubblica Web Payslips Source files
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Fetch all available payslips source files
                            (cedolone/LUL from 2021 to current) from Pubblica
                            Web and store them.
                        </p>
                        <StoreAllPubblicaWebPayslipSourceFilesButton />
                        <p className="text-sm text-muted-foreground">
                            Parse all not imported payslips source files and
                            generate related Pubblica Web payslip records.
                        </p>
                        <ParseAndCreateMissingPubblicaWebPayslipsButton />
                    </BrutalCard>

                    <BrutalCard className="space-y-3">
                        <h2 className={brutalTheme.typography.subheading}>
                            Sync all payrolls
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Sync all present payslips in pubblica web table with
                            the official payslips table across all years (from
                            2021 to current). This may take a while.
                        </p>
                        <ImportPubblicaWebPayslipsButton />
                    </BrutalCard>

                    <BrutalCard className="space-y-3">
                        <h2 className={brutalTheme.typography.subheading}>
                            Re-Sync all payrolls
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Parse again all employees payslips. Handy if you
                            changed the payslips tables. It may take a while.
                        </p>
                        <ReparsePubblicaWebPayslipsButton />
                    </BrutalCard>

                    <BrutalCard className="col-span-2">
                        <SyncTimesheets />
                    </BrutalCard>
                </div>
            </div>
        </BrutalContainer>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic";
