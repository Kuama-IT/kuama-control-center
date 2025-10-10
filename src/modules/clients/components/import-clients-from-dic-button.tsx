"use client";

import { BrutalButton } from "@/modules/ui";
import { useImportClientsFromFattureInCloudMutation } from "../mutations/clients.mutations";
import { useEffect } from "react";
import { isFailure } from "@/utils/failures.utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export function ImportClientsFromDicButton() {
  const mutation = useImportClientsFromFattureInCloudMutation();

  useEffect(() => {
    if (mutation.data) {
      if (!isFailure(mutation.data)) {
        notifySuccess(mutation.data.message);
        return;
      }

      notifyError(mutation.data.message);
    }
  }, [mutation.data]);
  return (
    <BrutalButton
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Importing" : "Run import"}
    </BrutalButton>
  );
}
