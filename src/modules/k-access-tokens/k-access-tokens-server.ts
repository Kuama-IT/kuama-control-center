import list from "@/modules/k-access-tokens/actions/k-access-token-list";
import create from "@/modules/k-access-tokens/actions/k-access-token-create";
import remove from "@/modules/k-access-tokens/actions/k-access-token-delete";

export const kAccessTokensServer = {
  list,
  create,
  remove,
};
