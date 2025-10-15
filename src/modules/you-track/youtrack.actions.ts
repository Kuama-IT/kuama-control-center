"use server";

import { serverActionUtils } from "@/utils/server-actions.utils";
import { youTrackServer } from "./youtrack.server";

export const importYouTrackProjectsAction = serverActionUtils.createSafeAction(
    youTrackServer.importAllProjects,
    ["/clients/settings/mappings"],
);
