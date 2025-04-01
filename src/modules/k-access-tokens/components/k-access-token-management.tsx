import { Title } from "@/modules/ui/components/title";
import KAccessTokenList from "@/modules/k-access-tokens/components/k-access-token-list";
import { KAccessTokenCreateForm } from "@/modules/k-access-tokens/components/k-access-token-create-form";

export default async function KAccessTokenManagement() {
  return (
    <div className="flex flex-col gap-4">
      <Title>K Access Token Management</Title>
      <p className="text-gray-500">
        Manage your K Access Tokens here. You can create and delete tokens as
        needed.
      </p>
      <div className="flex gap-4">
        <div>
          <KAccessTokenCreateForm />
        </div>
        <div className="flex-1">
          <KAccessTokenList />
        </div>
      </div>
    </div>
  );
}
