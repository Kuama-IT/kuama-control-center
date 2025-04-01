import { kAccessTokensServer } from "@/modules/k-access-tokens/k-access-tokens-server";
import { isFailure } from "@/utils/server-action-utils";
import { CopyButton } from "next/dist/client/components/react-dev-overlay/ui/components/copy-button";
import { KAccessTokenListItem } from "@/modules/k-access-tokens/components/k-access-token-list-item";

export default async function KAccessTokenList() {
  const kAccessTokens = await kAccessTokensServer.list();
  if (isFailure(kAccessTokens)) {
    return <pre>Could not load access tokens</pre>;
  }

  if (kAccessTokens.length === 0) {
    return <p>You don't have access tokens yet 😌!</p>;
  }
  return (
    <ul className="flex flex-col gap-4 p-4">
      {kAccessTokens.map((token) => (
        <KAccessTokenListItem token={token} key={token.id} />
      ))}
    </ul>
  );
}
