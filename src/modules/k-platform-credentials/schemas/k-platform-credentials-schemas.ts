import { z } from "zod";

export const KSupportedPlatforms = z.enum(["gitlab", "jira", "easyredmine"]);

export const kPlatformCredentialsFormSchema = z.object({
  platform: KSupportedPlatforms,
  name: z.string(),
  persistentToken: z.string(),
  endpoint: z.string().url(),
  clientId: z.number(),
  employeeId: z.number().optional(),
  projectId: z.number().optional(),
});

export type KPlatformCredentialsValidForm = z.infer<
  typeof kPlatformCredentialsFormSchema
>;
