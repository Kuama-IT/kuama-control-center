import { z } from "zod";

export const KSupportedPlatforms = z.enum(["gitlab", "jira"]);

export const kPlatformCredentialsFormSchema = z.object({
  platform: KSupportedPlatforms,
  name: z.string(),
  persistentToken: z.string(),
  endpoint: z.string().url(),
  // TODO uncomment when we want to allow to create credentials without visiting  project / client
  // clientId: z.number(),
  // projectId: z.number().optional(),
});

export type KPlatformCredentialsValidForm = z.infer<
  typeof kPlatformCredentialsFormSchema
>;
