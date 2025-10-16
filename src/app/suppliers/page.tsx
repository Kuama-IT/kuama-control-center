import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { SupplierList } from "@/modules/suppliers/components/suppliers-list";

async function Page() {
    return <SupplierList />;
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
