import { redirect } from "next/navigation";
import { PageParams } from "@/modules/routing/schemas/routing-schemas";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string() });

export default async function Page(params: PageParams) {
  const awaited = await params.params;
  const { id } = paramsSchema.parse(awaited);
  redirect(`/employees/${id}`);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
