import { accessTokensServer } from "@/modules/access-tokens/access-tokens.server";
import { AccessTokenListItem } from "@/modules/access-tokens/components/access-token-list-item";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";

export default async function AccessTokenList() {
    const accessTokens = await accessTokensServer.list();
    if (isFailure(accessTokens)) {
        return <ErrorMessage failure={accessTokens} />;
    }

    if (accessTokens.length === 0) {
        return <p>{"You don't have access tokens yet 😌!"}</p>;
    }
    return (
        <ul className="flex flex-col gap-4 p-4">
            {accessTokens.map((token) => (
                <AccessTokenListItem token={token} key={token.id} />
            ))}
        </ul>
    );
}
