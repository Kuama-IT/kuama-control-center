import { revalidatePath } from "next/cache";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import syncDipendentiInCloudEmployees from "@/modules/dipendenti-in-cloud/actions/dipendenti-in-cloud-import-employees-action";
import syncDipendentiInCloudPayrollsAction from "@/modules/dipendenti-in-cloud/actions/sync-dipendenti-in-cloud-payrolls-action";
import { BrutalButton, BrutalCard, BrutalContainer, brutalTheme } from "@/modules/ui";
import Link from "next/link";
import { ImportEmployeesButton } from "@/modules/employees/components/import-employees-button";
import { ImportPubblicaWebPayslipsButton } from "@/modules/payslips/components/import-pubblica-web-payslips-button";

async function Page() {
  
  const heading = (
    <div className="flex items-center justify-between">
      <h1 className={brutalTheme.typography.heading}>Employees · Imports</h1>
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
            <h2 className={brutalTheme.typography.subheading}>Import from Dipendenti in Cloud</h2>
            <p className="text-sm text-muted-foreground">
              Fetch active employees from Dipendenti in Cloud and upsert them in the local database.
            </p>
            <ImportEmployeesButton />
          </BrutalCard>

          <BrutalCard className="space-y-3">
            <h2 className={brutalTheme.typography.subheading}>Sync all payrolls</h2>
            <p className="text-sm text-muted-foreground">
              Download and sync payrolls for all employees across all years (from 2021 to current). This may take a while.
            </p>
            <ImportPubblicaWebPayslipsButton />
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
