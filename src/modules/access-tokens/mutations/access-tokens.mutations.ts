"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/use-server-action-mutation";
import { createAccessToken } from "../access-tokens.actions";

export const useCreateAccessTokenMutation = () =>
  useServerActionMutation({ action: createAccessToken });
