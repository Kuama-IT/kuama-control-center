import list from "@/modules/k-access-tokens/actions/k-access-token-list";
import create from "@/modules/k-access-tokens/actions/k-access-token-create";
import remove from "@/modules/k-access-tokens/actions/k-access-token-delete";
import manage from "@/modules/k-access-tokens/actions/k-access-token-manage";
import getNonExpiredToken from "@/modules/k-access-tokens/actions/k-access-token-get-not-expired";

export const kAccessTokensServer = {
  list,
  create,
  remove,
  manage,
  getNonExpiredToken,
};
