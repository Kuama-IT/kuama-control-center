"use client";
import { cn } from "@/lib/utils";
import { BrutalButton } from "@/modules/ui";
import { FaSync } from "react-icons/fa";
import { useYouTrackImportOrganizationsMutation } from "../mutations/youtrack.mutations";
import { useEffect } from "react";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

export const YtImportOrganizationsButton = () => {
  const mutation = useYouTrackImportOrganizationsMutation();

  useEffect(() => {
    if (mutation.data) {
      if (!isFailure(mutation.data)) {
        notifySuccess(mutation.data.message)
        return
      }

      notifyError(mutation.data.message)
    }
  }, [ mutation.data])
  return (
    <BrutalButton disabled={mutation.isPending} onClick={() => mutation.mutate()}>
      <FaSync className={cn({ "animate-spin": mutation.isPending })} />
      Import YT Organizations
    </BrutalButton>
  );
};
