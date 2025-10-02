"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/useServerActionMutation";
import {
    createAccessToken
} from "../access-tokens.actions";

export const useCreateAccessTokenMutation = () =>
  useServerActionMutation(createAccessToken);
