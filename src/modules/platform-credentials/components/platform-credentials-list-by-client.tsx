import { auth } from "@/modules/auth/auth";
import { Title } from "@/modules/ui/components/title";
import { isFailure } from "@/utils/server-action-utils";
import { platformCredentialsServer } from "../platform-credentials.server";
import PlatformCredentialsCard from "./platform-credentials-card";
import PlatformCredentialsForm from "./platform-credentials-form";

type Props = {
    clientId: number;
    showAddCredentials?: boolean;
};
export default async function PlatformCredentialsListByClient({
    clientId,
    showAddCredentials,
}: Props) {
    const credentials = await platformCredentialsServer.byClient(clientId);

    const session = await auth();

    if (isFailure(credentials)) {
        return <div>{credentials.message}</div>;
    }
    return (
        <div className="flex flex-col gap-8 p-8">
            <Title>Time spent import credentials</Title>

            <div className="flex gap-4">
                {credentials.map((credential: any) => (
                    <PlatformCredentialsCard
                        key={credential.id}
                        credentials={credential}
                    />
                ))}

                {showAddCredentials && session?.user?.isAdmin && (
                    <div className="">
                        <PlatformCredentialsForm clientId={clientId} />
                    </div>
                )}
            </div>
        </div>
    );
}
