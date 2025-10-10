import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { importYouTrackOrganizationsAction } from "../youtrack.actions";

export const useYouTrackImportOrganizationsMutation = () => {
  return useServerActionMutation({ action: importYouTrackOrganizationsAction });
};
