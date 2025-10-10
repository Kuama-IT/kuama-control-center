import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { importFromPubblicaWebPayslipsAction } from "../payslips.actions";

export function useImportFromPubblicaWebPayslipsMutation() {
  return useServerActionMutation({
    action: importFromPubblicaWebPayslipsAction,
  });
}
