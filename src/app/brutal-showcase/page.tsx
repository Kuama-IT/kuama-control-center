import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { PageParams } from "@/modules/routing/schemas/routing-schemas";
import BrutalUIShowcase from "./brutal-ui-showcase";

async function Page(pageParams: PageParams | undefined) {
    return <BrutalUIShowcase />;
}

export default async function (params: PageParams) {
    return await AuthenticatedPageWrapper(Page, params);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
