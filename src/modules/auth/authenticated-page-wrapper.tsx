import { redirect } from "next/navigation";
import { auth } from "@/modules/auth/auth";
import { JSX } from "react";
import { PageParams } from "@/modules/routing/schemas/routing-schemas";

export async function AuthenticatedPageWrapper(
  pageComponent: (params: PageParams | undefined) => Promise<JSX.Element>,
  params: PageParams | undefined = undefined,
) {
  const session = await auth();
  if (!session?.user) {
    return redirect("/sign-in");
  }
  return await pageComponent(params);
}
