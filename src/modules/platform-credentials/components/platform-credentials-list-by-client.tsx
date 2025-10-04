import { Title } from "@/modules/ui/components/title";
import PlatformCredentialsForm from "./platform-credentials-form";
import PlatformCredentialsCard from "./platform-credentials-card";
import { isFailure } from "@/utils/server-action-utils";
import { auth } from "@/modules/auth/auth";
import { platformCredentialsServer } from "../platform-credentials.server";

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
		<div className="p-8 flex flex-col gap-8">
			<Title>Time spent import credentials</Title>

			<div className="flex gap-4">
			{credentials.map((credential: any) => (
					<PlatformCredentialsCard key={credential.id} credentials={credential} />
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
