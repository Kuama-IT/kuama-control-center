import { cashFlowImportServer } from "@/modules/cash-flow/cash-flow-import.server";
import { BankStatementCreateForm } from "@/modules/cash-flow/components/bank-statement-create-form";
import { Title } from "@/modules/ui/components/title";
import { CashFlowImportEntry } from "./cash-flow-import-entry";

export async function CashFlowImports() {
    const entries = await cashFlowImportServer.getAll();

    return (
        <div className="flex flex-col gap-8 p-8">
            <Title>{"Cash Flow Imports"}</Title>
            <div className="grid grid-cols-3">
                <div className="col-span-2">
                    {entries.map((importEntry) => (
                        <CashFlowImportEntry
                            key={importEntry.id}
                            entry={importEntry}
                        />
                    ))}
                </div>
                <div className="sticky top-0">
                    <BankStatementCreateForm />
                </div>
            </div>
        </div>
    );
}
