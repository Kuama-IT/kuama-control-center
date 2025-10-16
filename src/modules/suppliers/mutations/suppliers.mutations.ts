import { upsertAllSuppliersFromFattureInCloudAction } from "@/modules/suppliers/suppliers.actions";
import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";

export const useUpsertAllSuppliersFromFattureInCloudMutation = () =>
    useServerActionMutation({
        action: upsertAllSuppliersFromFattureInCloudAction,
    });
