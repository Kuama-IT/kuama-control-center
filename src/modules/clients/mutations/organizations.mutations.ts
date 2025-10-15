"use client";

import { importOrganizationsFromYouTrackAction } from "@/modules/clients/organizations.actions";
import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";

export const useImportOrganizationsFromYouTrackMutation = () => {
    return useServerActionMutation({
        action: importOrganizationsFromYouTrackAction,
    });
};
