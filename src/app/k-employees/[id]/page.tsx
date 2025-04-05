import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import KEmployeeDetail from "@/modules/k-employees/components/k-employee-detail";
import { PageParams } from "@/modules/routing/schemas/routing-schemas";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string(),
});

async function Page(pageParams: PageParams | undefined) {
  if (!pageParams) {
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "__invalid_params__",
          message: "Missing page params",
        }}
      />
    );
  }
  const awaited = await pageParams.params;

  const { id } = paramsSchema.parse(awaited);

  return <KEmployeeDetail id={Number(id)} />;
}

export default async function (params: PageParams) {
  return await AuthenticatedPageWrapper(Page, params);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
