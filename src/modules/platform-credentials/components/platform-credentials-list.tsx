import { auth } from "@/modules/auth/auth";
import { clientsServer } from "@/modules/clients/clients.server";
import { Title } from "@/modules/ui/components/title";
import { isFailure } from "@/utils/server-action-utils";
import { platformCredentialsServer } from "../platform-credentials.server";
import PlatformCredentialsCard from "./platform-credentials-card";
import PlatformCredentialsForm from "./platform-credentials-form";

export default async function PlatformCredentialsList() {
    const credentials = await platformCredentialsServer.all();
    const clients = await clientsServer.allOrganizations();

    const session = await auth();

    if (!session?.user || !session.user.isAdmin) {
        return null;
    }

    if (isFailure(credentials)) {
        return <div>{credentials.message}</div>;
    }
    if (isFailure(clients)) {
        return <div>{clients.message}</div>;
    }
    return (
        <div className="flex flex-col gap-8 p-8">
            <Title>{"Platform credentials"}</Title>

            <div className="flex flex-col gap-4">
                {credentials.map((credential) => (
                    <PlatformCredentialsCard
                        key={credential.id}
                        credentials={credential}
                    />
                ))}

                <div className="">
                    <PlatformCredentialsForm clients={clients} />
                </div>
            </div>
        </div>
    );
}
