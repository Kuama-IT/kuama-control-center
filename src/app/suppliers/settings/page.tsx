import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { SuppliersSettings } from "@/modules/suppliers/components/suppliers-settings";

async function Page() {
    return <SuppliersSettings />;
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
