import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { Title } from "@/modules/ui/components/title";
import { KPlatformCredentialsForm } from "@/modules/k-platform-credentials/components/k-platform-credentials-form";
import { KPlatformCredentialsCard } from "@/modules/k-platform-credentials/components/k-platform-credentials-card";
import { isFailure } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";
import { kClientsServer } from "@/modules/k-clients/k-clients-server";

export default async function KPlatformCredentialsList() {
  const credentials = await kPlatformCredentialsServer.all();
  const clients = await kClientsServer.listAll();

  const session = await auth();

  if (isFailure(credentials)) {
    return <div>{credentials.message}</div>;
  }
  if (isFailure(clients)) {
    return <div>{clients.message}</div>;
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

        <div className="">
          <KPlatformCredentialsForm clients={clients} />
        </div>
      </div>
    </div>
  );
}
