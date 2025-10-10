"use client";

import { BrutalButton } from "@/modules/ui";
import { useYouTrackImportOrganizationsMutation } from "../mutations/youtrack.mutations";
import { useEffect } from "react";
import { isFailure } from "@/utils/failures.utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const YtImportOrganizationsButton = () => {
  const mutation = useYouTrackImportOrganizationsMutation();

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
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "Importing..." : "Import YT Organizations"}
    </BrutalButton>
  );
};
