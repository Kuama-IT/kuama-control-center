import { z } from "zod";
import CashFlowImportPreviewServer from "@/modules/cash-flow/components/cash-flow-import-preview-server";
import { type PageParams } from "@/modules/routing/schemas/routing-schemas";

const paramsSchema = z.object({
    id: z.string(),
});

export default async function Page({ params }: PageParams) {
    const awaited = await params;

    const { id } = paramsSchema.parse(awaited);
    return <CashFlowImportPreviewServer id={id} />;
}
