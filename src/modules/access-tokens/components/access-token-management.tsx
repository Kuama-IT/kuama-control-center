import { AccessTokenCreateForm } from "@/modules/access-tokens/components/access-token-create-form";
import AccessTokenList from "@/modules/access-tokens/components/access-token-list";
import { Title } from "@/modules/ui/components/title";

export default async function AccessTokenManagement() {
    return (
        <div className="flex flex-col gap-4">
            <Title>Access Token Management</Title>
            <p className="text-gray-500">
                Manage your access tokens here. You can create and delete tokens
                as needed.
            </p>
            <div className="flex gap-4">
                <div>
                    <AccessTokenCreateForm />
                </div>
                <div className="flex-1">
                    <AccessTokenList />
                </div>
            </div>
        </div>
    );
}
