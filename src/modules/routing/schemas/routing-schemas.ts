import { z } from "zod";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;
export type SlugParams = Promise<{
  [key: string]: string | undefined;
}>;

export type PageParams = {
  searchParams?: SearchParams;
  params?: SlugParams;
};

export const datePeriodParamsSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const accessTokenParamsSchema = z.object({
  accessToken: z.string(),
});
