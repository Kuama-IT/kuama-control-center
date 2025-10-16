import { redirect } from "next/navigation";
import { type JSX } from "react";
import { auth } from "@/modules/auth/auth";
import { type PageParams } from "@/modules/routing/schemas/routing-schemas";

export async function AuthenticatedPageWrapper(
    pageComponent: (pageParams: PageParams | undefined) => Promise<JSX.Element>,
    params: PageParams | undefined = undefined,
) {
    const session = await auth();
    if (!session?.user) {
        return redirect("/sign-in");
    }
    return await pageComponent(params);
}
