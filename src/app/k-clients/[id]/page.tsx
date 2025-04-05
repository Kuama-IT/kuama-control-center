import KClientDetail from "@/modules/k-clients/components/k-client-detail";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { PageParams } from "@/modules/routing/schemas/routing-schemas";
import { z } from "zod";
import { ErrorMessage } from "@/modules/ui/components/error-message";

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
  return (
    <div>
      <KClientDetail id={id} />
    </div>
  );
}

export default async function (params: PageParams) {
  return await AuthenticatedPageWrapper(Page, params);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
