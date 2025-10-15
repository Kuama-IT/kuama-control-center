import { organizationsServer } from "@/modules/clients/organizations.server";
import { serverActionUtils } from "@/utils/server-actions.utils";

export const importOrganizationsFromYouTrackAction =
    serverActionUtils.createSafeAction(
        organizationsServer.upsertAllFromYouTrack,
        ["/clients/settings/mappings"],
    );
