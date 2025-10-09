"use server";

import { serverActionUtils } from "@/utils/server-actions.utils";
import { youTrackServer } from "./youtrack.server";

export const importYouTrackOrganizationsAction =
  serverActionUtils.createSafeAction(youTrackServer.importAllOrganizations, [
    "/clients/settings/mappings",
  ]);
