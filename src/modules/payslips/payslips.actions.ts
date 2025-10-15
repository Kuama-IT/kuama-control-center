"use server";

import { serverActionUtils } from "@/utils/server-actions.utils";
import { payslipsServer } from "./payslips.server";

export const importFromPubblicaWebPayslipsAction =
    serverActionUtils.createSafeAction(
        payslipsServer.importFromPubblicaWebPayslips,
        [],
    );
