"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import {
    parseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsAction,
    parseAllPubblicaWebUnparsedMonthlyBalancesAction,
    reparsePubblicaWebPayslipsAction,
    storePubblicaWebMissingMonthlyBalancesSince2021Action,
    storePubblicaWebMissingPayslipSourceFilesSince2021Action,
} from "@/modules/pubblica-web/pubblica-web.actions";

export const useReparsePubblicaWebPayslipsMutation = () => {
    return useServerActionMutation({
        action: reparsePubblicaWebPayslipsAction,
    });
};

export const useStorePubblicaWebMissingMonthlyBalancesSince2021Mutation = () =>
    useServerActionMutation({
        action: storePubblicaWebMissingMonthlyBalancesSince2021Action,
    });

export const useParseAllPubblicaWebUnparsedMonthlyBalancesMutation = () =>
    useServerActionMutation({
        action: parseAllPubblicaWebUnparsedMonthlyBalancesAction,
    });

export const useStorePubblicaWebMissingPayslipSourceFilesSince2021Mutation =
    () =>
        useServerActionMutation({
            action: storePubblicaWebMissingPayslipSourceFilesSince2021Action,
        });

export const useParseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsMutation =
    () =>
        useServerActionMutation({
            action: parseAllPubblicaWebUnimportedPayslipsSourceFilesAndCreatePubblicaWebPayslipsAction,
        });
