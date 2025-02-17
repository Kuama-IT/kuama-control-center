import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { Title } from "@/modules/ui/components/title";
import { KPlatformCredentialsForm } from "@/modules/k-platform-credentials/components/k-platform-credentials-form";
import { KPlatformCredentialsCard } from "@/modules/k-platform-credentials/components/k-platform-credentials-card";
import { isFailure } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";

type Props = {
  clientId: number;
  showAddCredentials?: boolean;
};
export default async function KPlatformCredentialsList({
  clientId,
  showAddCredentials,
}: Props) {
  const credentials = await kPlatformCredentialsServer.byClient(clientId);

  const session = await auth();

  if (isFailure(credentials)) {
    return <div>{credentials.message}</div>;
  }
  return (
    <div className="p-8 flex flex-col gap-8">
      <Title>Time spent import credentials</Title>

      <div className="flex gap-4">
        {credentials.map((credential) => (
          <KPlatformCredentialsCard
            key={credential.id}
            credentials={credential}
          />
        ))}

        {showAddCredentials && session?.user?.isAdmin && (
          <div className="">
            <KPlatformCredentialsForm clientId={clientId} />
          </div>
        )}
      </div>
    </div>
  );
}
