"use client";

import { useEffect } from "react";
import { useProjectUpsertFromYouTrackMutation } from "@/modules/projects/mutations/projects.mutations";
import { BrutalButton } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/failures.utils";

export const ProjectsUpsertAllFromYouTrackButton = () => {
    const mutation = useProjectUpsertFromYouTrackMutation();

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
            {mutation.isPending ? "Importing..." : "Import YT Projects"}
        </BrutalButton>
    );
};
