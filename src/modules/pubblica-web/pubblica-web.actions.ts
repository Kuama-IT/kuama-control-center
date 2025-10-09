"use server";

import { serverActionUtils } from "@/utils/server-actions.utils";
import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";

export const reparsePubblicaPayslipsAction = serverActionUtils.createSafeAction(
  pubblicaWebServer.parseAllPayslipSourceFiles,
);
