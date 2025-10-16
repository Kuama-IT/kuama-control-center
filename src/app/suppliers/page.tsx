import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import { SupplierList } from "@/modules/suppliers/components/suppliers-list";

async function Page() {
    return (
        <div className="mx-auto max-w-(--breakpoint-lg) pt-4">
            <SupplierList />
        </div>
    );
}

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}

export const dynamic = "force-dynamic"; // opt-out of static rendering
