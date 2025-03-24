import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import { Title } from "@/modules/ui/components/title";
import { KPlatformCredentialsForm } from "@/modules/k-platform-credentials/components/k-platform-credentials-form";
import { KPlatformCredentialsCard } from "@/modules/k-platform-credentials/components/k-platform-credentials-card";
import { isFailure } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";
import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function KPlatformCredentialsList() {
  const credentials = await kPlatformCredentialsServer.all();
  const clients = await kClientsServer.listAll();

  const session = await auth();

  if (!session?.user || !session.user.isAdmin) {
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "__unauthorized__",
          message: "Unauthorized",
        }}
      />
    );
  }

  if (isFailure(credentials)) {
    return <ErrorMessage failure={credentials} />;
  }
  if (isFailure(clients)) {
    return <ErrorMessage failure={clients} />;
  }
  return (
    <div className="p-8 flex flex-col gap-8">
      <Title>Platform credentials</Title>

      <div className="flex flex-col gap-4">
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
