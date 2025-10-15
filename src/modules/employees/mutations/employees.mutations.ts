import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { importFromDipendentiInCloudAndYouTrackAction } from "../employees.actions";

export function useImportEmployeesMutation() {
    return useServerActionMutation({
        action: importFromDipendentiInCloudAndYouTrackAction,
    });
}
