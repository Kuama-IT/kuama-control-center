"use server";

import { handleServerErrors } from "@/utils/server-action-utils";
import { cashFlowService } from "./cash-flow.service";

export const handledDeleteCashFlowImport = handleServerErrors(
  async (id: number) => {
    await cashFlowService.deleteCashFlowImport(id);
  }
);
