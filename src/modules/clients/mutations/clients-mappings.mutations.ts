"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import {
  linkOrganizationToClientAction,
  unlinkOrganizationFromClientAction,
} from "../clients.actions";

export const useLinkOrganizationToClientMutation = (id: number) => {
  return useServerActionMutation({
    action: linkOrganizationToClientAction,
    invalidateQueries: {
      queryKey: ["clients", id, "organization-link-suggestions"],
    },
  });
};

export const useUnlinkOrganizationFromClientMutation = (id: number) => {
  return useServerActionMutation({
    action: unlinkOrganizationFromClientAction,
    invalidateQueries: {
      queryKey: ["clients", id, "organization-link-suggestions"],
    },
  });
};
