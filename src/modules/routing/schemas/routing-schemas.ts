import { z } from "zod";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export const datePeriodParamsSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const accessTokenParamsSchema = z.object({
  accessToken: z.string(),
});
