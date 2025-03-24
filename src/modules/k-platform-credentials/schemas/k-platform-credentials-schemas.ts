import { z } from "zod";

export const KSupportedPlatforms = z.enum(["gitlab", "jira", "easyredmine"]);

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
