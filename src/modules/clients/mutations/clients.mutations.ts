import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { importFromFattureInCloudAction } from "../clients.actions";

export const useImportClientsFromFattureInCloudMutation = () => {
  return useServerActionMutation(importFromFattureInCloudAction);
};
