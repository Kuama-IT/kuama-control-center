import { z } from "zod";

const serverEnvSchema = z
  .object({
    DATABASE_URL: z.string().nonempty(),
    DIPENDENTI_IN_CLOUD_API_ENDPOINT: z.string().nonempty().endsWith("/"),
    DIPENDENTI_IN_CLOUD_PERSISTENT_TOKEN: z.string().nonempty(),
    GITHUB_ORGANIZATION: z.string().nonempty(),
    GITHUB_PERSISTENT_TOKEN: z.string().nonempty(),
    YOUTRACK_API_ENDPOINT: z.string().nonempty().endsWith("/"),
    YOUTRACK_PERSISTENT_TOKEN: z.string().nonempty(),
  })
  .transform((data) => {
    return {
      databaseUrl: data.DATABASE_URL,
      dipendentiInCloudApiEndpoint: data.DIPENDENTI_IN_CLOUD_API_ENDPOINT,
      dipendentiInCloudApiPersistentToken:
        data.DIPENDENTI_IN_CLOUD_PERSISTENT_TOKEN,
      githubOrganization: data.GITHUB_ORGANIZATION,
      githubPersistentToken: data.GITHUB_PERSISTENT_TOKEN,
      youtrackApiEndpoint: data.YOUTRACK_API_ENDPOINT,
      youtrackPersistentToken: data.YOUTRACK_PERSISTENT_TOKEN,
    };
  });

export const serverEnv = serverEnvSchema.parse(process.env);
