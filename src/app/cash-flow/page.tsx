import { cashFlowService } from "@/modules/cash-flow/cash-flow.service";
import { CashFlows } from "@/modules/cash-flow/components/cash-flows";

export default async function Page() {
    return <CashFlows />;
}
