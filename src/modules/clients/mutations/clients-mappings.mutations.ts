"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import {
  autoLinkYouTrackOrgsAction,
  linkOrganizationToClientAction,
  unlinkOrganizationFromClientAction,
} from "../clients.actions";

export const useAutoLinkMutation = () => {
  return useServerActionMutation(autoLinkYouTrackOrgsAction);
};

export const useLinkOrganizationToClientMutation = () => {
  return useServerActionMutation(linkOrganizationToClientAction);
};

export const useUnlinkOrganizationFromClientMutation = () => {
  return useServerActionMutation(unlinkOrganizationFromClientAction);
};
