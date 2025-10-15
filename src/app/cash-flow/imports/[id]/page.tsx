import CashFlowImportPreviewServer from "@/modules/cash-flow/components/cash-flow-import-preview-server";
import { CashFlowImports } from "@/modules/cash-flow/components/cash-flow-imports";
import { PageParams } from "@/modules/routing/schemas/routing-schemas";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string(),
});

export default async function Page(pageParams: PageParams) {
    const awaited = await pageParams;

    const { id } = paramsSchema.parse(awaited);
    return <CashFlowImportPreviewServer id={id} />;
}
