"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { reparsePubblicaPayslipsAction } from "@/modules/pubblica-web/pubblica-web.actions";

export const useReparsePubblicaWebPayslipsMutation = () => {
  return useServerActionMutation(reparsePubblicaPayslipsAction);
};
