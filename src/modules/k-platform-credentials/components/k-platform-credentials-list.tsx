import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { Title } from "@/modules/ui/components/title";

type Props = {
  clientId: number;
  projectId?: number;
};
export default async function KPlatformCredentialsList({
  clientId,
  projectId,
}: Props) {
  const credentials = await kPlatformCredentialsServer.byClient(
    clientId,
    projectId,
  );
  return (
    <div>
      <Title>Time spent import credentials</Title>
      <div>You got {credentials.length} credentials for this project</div>
    </div>
  );
}
