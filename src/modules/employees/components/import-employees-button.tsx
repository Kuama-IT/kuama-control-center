"use client";

import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/server-action-utils";
import { useImportEmployeesMutation } from "../mutations/employees.mutations";

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
