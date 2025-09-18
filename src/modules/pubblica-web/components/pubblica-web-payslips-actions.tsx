"use client";

import { useTransition } from "react";
import {
  handledSyncEmployeePayrolls,
  handledSyncPayslipsMonthlyBalances,
} from "../actions/payrolls.actions";
import { Button } from "@/components/ui/button";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const PubblicaFolderPayslipsActions = ({ year }: { year: string }) => {
  // use transition for better UX
  const [isPayslipSyncPending, startSyncPayslipsTransition] = useTransition();
  const [isMonthlyBalanceSyncPending, startSyncMonthlyBalanceTransition] =
    useTransition();

  const onSyncPayslipsClick = () => {
    startSyncPayslipsTransition(async () => {
      const res = await handledSyncEmployeePayrolls({ year });
      if (isFailure(res)) {
        // toast error
        notifyError(`Error: ${res.message}`);
      } else {
        notifySuccess(`Payslips for ${year} downloaded successfully`);
      }
    });
  };

  const onSyncMonthlyBalanceClick = () => {
    startSyncMonthlyBalanceTransition(async () => {
      const res = await handledSyncPayslipsMonthlyBalances({ year });
      if (isFailure(res)) {
        // toast error
        notifyError(`Error: ${res.message}`);
      } else {
        notifySuccess(`Monthly balances for ${year} downloaded successfully`);
      }
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        disabled={isPayslipSyncPending}
        onClick={() => onSyncPayslipsClick()}
      >
        {isPayslipSyncPending ? "Syncing..." : "Sync Payslips"}
      </Button>
      <Button
        disabled={isMonthlyBalanceSyncPending}
        onClick={() => onSyncMonthlyBalanceClick()}
      >
        {isMonthlyBalanceSyncPending ? "Syncing..." : "Sync Monthly Balances"}
      </Button>
    </div>
  );
};
