import { z } from "zod";
import { KEmployeesRead } from "@/modules/k-employees/schemas/k-employees-schemas";
import { KProjectsRead } from "@/modules/k-projects/schemas/k-projects-schemas";

export const KSupportedPlatforms = z.enum([
  "github",
  "gitlab",
  "jira",
  "easyredmine",
  "youtrack",
]);

export const kPlatformCredentialsFormSchema = z.object({
  platform: KSupportedPlatforms,
  name: z.string(),
  persistentToken: z.string(),
  endpoint: z.string().url(),
  clientId: z.string(),
  employeeId: z.string().optional(),
  projectId: z.string().optional(),
});

export const kPlatformCredentialsInsertSchema = z.object({
  platform: KSupportedPlatforms,
  name: z.string(),
  persistentToken: z.string(),
  endpoint: z.string().url(),
  clientId: z
    .string()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  employeeId: z
    .string()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .optional(),
  projectId: z
    .string()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .optional(),
});

export type KPlatformCredentialsInsert = z.infer<
  typeof kPlatformCredentialsInsertSchema
>;

export type KPlatformCredentialsValidForm = z.infer<
  typeof kPlatformCredentialsFormSchema
>;

export const kPlatformCredentialsReadSchema = z.object({
  id: z.number(),
  platform: KSupportedPlatforms,
  name: z.string(),
  persistentToken: z.string(),
  endpoint: z.url(),
});
export type KPlatformCredentialsRead = z.infer<
  typeof kPlatformCredentialsReadSchema
>;

export type KPlatformCredentialsFullRead = KPlatformCredentialsRead & {
  kEmployee?: KEmployeesRead;
  kProject?: KProjectsRead;
};
