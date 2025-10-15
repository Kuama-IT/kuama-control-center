import { type Metadata } from "next";
import { IoMdSettings } from "react-icons/io";
import AccessTokenManagement from "@/modules/access-tokens/components/access-token-management";
import { AuthenticatedPageWrapper } from "@/modules/auth/authenticated-page-wrapper";
import PlatformCredentialsList from "@/modules/platform-credentials/components/platform-credentials-list";
import { BackButton } from "@/modules/ui/components/back-button";
import { Title } from "@/modules/ui/components/title";

export const metadata: Metadata = {
    title: "Settings | K1 App",
    description: "Settings | Kuama Control Center",
};

async function Page() {
    return (
        <div className="flex flex-col gap-8 px-8 pt-8">
            <div className="flex items-center gap-4">
                <BackButton />{" "}
                <Title icon={<IoMdSettings />}>{"Settings"}</Title>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                    <PlatformCredentialsList />
                </div>

                <div className="col-span-4">
                    <AccessTokenManagement />
                </div>
            </div>
        </div>
    );
}

export const dynamic = "force-dynamic"; // opt-out of static rendering

export default async function () {
    return await AuthenticatedPageWrapper(Page);
}
