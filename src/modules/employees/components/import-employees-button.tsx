"use client";

import { Button } from "@/components/ui/button";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { useImportEmployeesMutation } from "../mutations/employees.mutations";
import { BrutalButton } from "@/modules/ui";

export function ImportEmployeesButton() {
  const { mutateAsync, isPending } = useImportEmployeesMutation();

  const onClick = async () => {
    const res = await mutateAsync();
    if (isFailure(res)) {
      notifyError(res.message ?? "Failed to import employees");
      return;
    }
    notifySuccess("EmployeeList imported successfully");
  };

  return (
    <BrutalButton onClick={onClick} disabled={isPending}>
      {isPending ? "Syncing..." : "Sync employees (DIC + YT)"}
    </BrutalButton>
  );
}
