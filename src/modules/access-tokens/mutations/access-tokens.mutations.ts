"use client";

import { useServerActionMutation } from "@/modules/ui/hooks/useServerActionMutation";
import {
  createAccessToken,
  type CreateAccessTokenResult,
} from "../access-tokens.actions";
import type { AccessTokenCreate } from "../schemas/access-token.schema";

export const useCreateAccessTokenMutation = () =>
  useServerActionMutation(createAccessToken);
