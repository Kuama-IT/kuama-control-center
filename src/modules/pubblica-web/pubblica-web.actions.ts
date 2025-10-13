"use server";

import { serverActionUtils } from "@/utils/server-actions.utils";
import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";

export const reparsePubblicaWebPayslipsAction =
  serverActionUtils.createSafeAction(
    pubblicaWebServer.parseAllPayslipSourceFiles,
  );

export const storePubblicaWebMissingMonthlyBalancesSince2021Action =
  serverActionUtils.createSafeAction(
    pubblicaWebServer.storeMissingMonthlyBalancesSince2021,
  );

export const parseAllPubblicaWebUnparsedMonthlyBalancesAction =
  serverActionUtils.createSafeAction(
    pubblicaWebServer.parseAllUnparsedMonthlyBalances,
  );

export const storePubblicaWebMissingPayslipSourceFilesSince2021Action =
  serverActionUtils.createSafeAction(
    pubblicaWebServer.storePayslipsSourceFileSince2021,
  );

export const parseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsAction =
  serverActionUtils.createSafeAction(
    pubblicaWebServer.parseAndStoreAllUnimportedPayslipsSourceFiles,
  );
