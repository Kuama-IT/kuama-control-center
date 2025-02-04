import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { Title } from "@/modules/ui/components/title";
import { KPlatformCredentialsForm } from "@/modules/k-platform-credentials/components/k-platform-credentials-form";

type Props = {
  clientId: number;
  projectId?: number;
  showAddCredentials?: boolean;
};
export default async function KPlatformCredentialsList({
  clientId,
  projectId,
  showAddCredentials,
}: Props) {
  const credentials = await kPlatformCredentialsServer.byClient(
    clientId,
    projectId,
  );
  return (
    <div className="p-8">
      <Title>Time spent import credentials</Title>
      <div>You got {credentials.length} credentials for this project</div>

      <div className="flex gap-4">
        {credentials.map((credential) => (
          <pre key={credential.id}>{JSON.stringify(credential, null, 2)}</pre>
        ))}

        {/* TODO only admin */}
        <div className="bg-accent p-4 rounded text-foreground flex flex-col gap-4 items-center justify-center">
          <KPlatformCredentialsForm clientId={clientId} />
        </div>
      </div>
    </div>
  );
}
