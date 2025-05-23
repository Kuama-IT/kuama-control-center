import { z } from "zod";

const serverEnvSchema = z
  .object({
    DATABASE_URL: z.string().nonempty(),
    DIPENDENTI_IN_CLOUD_API_ENDPOINT: z.string().nonempty().endsWith("/"),
    DIPENDENTI_IN_CLOUD_PERSISTENT_TOKEN: z.string().nonempty(),
    FATTURE_IN_CLOUD_PERSISTENT_TOKEN: z.string().nonempty(),
    FATTURE_IN_CLOUD_COMPANY_ID: z.string().nonempty(),
    GITHUB_ORGANIZATION: z.string().nonempty(),
    GITHUB_PERSISTENT_TOKEN: z.string().nonempty(),
    YOUTRACK_API_ENDPOINT: z.string().nonempty().endsWith("/"),
    YOUTRACK_PERSISTENT_TOKEN: z.string().nonempty(),
    CURRANT_GITLAB_ENDPOINT: z.string().nonempty().endsWith("/"),
    CURRANT_GITLAB_PERSISTENT_TOKEN: z.string().nonempty(),
    BLESS_TOKEN: z.string().nonempty(),
    YOUTRACK_AUTH_CLIENT_ID: z.string().nonempty(),
    YOUTRACK_AUTH_CLIENT_SECRET: z.string().nonempty(),
    YOUTRACK_AUTH_ISSUER: z.string().nonempty(),
    NODE_ENV: z.string().nonempty().optional(),
    PUBBLICA_WEB_USERNAME: z.string().nonempty(),
    PUBBLICA_WEB_PASSWORD: z.string().nonempty(),
    SHOW_DATABASE_LOGS: z.string().nonempty().optional(),
  })
  .transform((data) => {
    return {
      databaseUrl: data.DATABASE_URL,
      dipendentiInCloudApiEndpoint: data.DIPENDENTI_IN_CLOUD_API_ENDPOINT,
      dipendentiInCloudApiPersistentToken:
        data.DIPENDENTI_IN_CLOUD_PERSISTENT_TOKEN,
      fattureInCloudApiPersistentToken: data.FATTURE_IN_CLOUD_PERSISTENT_TOKEN,
      fattureInCloudCompanyId: data.FATTURE_IN_CLOUD_COMPANY_ID,
      githubOrganization: data.GITHUB_ORGANIZATION,
      githubPersistentToken: data.GITHUB_PERSISTENT_TOKEN,
      youtrackApiEndpoint: data.YOUTRACK_API_ENDPOINT,
      youtrackPersistentToken: data.YOUTRACK_PERSISTENT_TOKEN,
      currantGitlabEndpoint: data.CURRANT_GITLAB_ENDPOINT,
      currantGitlabPersistentToken: data.CURRANT_GITLAB_PERSISTENT_TOKEN,
      blessToken: data.BLESS_TOKEN,
      youtrackAuthClientId: data.YOUTRACK_AUTH_CLIENT_ID,
      youtrackAuthClientSecret: data.YOUTRACK_AUTH_CLIENT_SECRET,
      youtrackAuthIssuer: data.YOUTRACK_AUTH_ISSUER,
      pubblicaWebUsername: data.PUBBLICA_WEB_USERNAME,
      pubblicaWebPassword: data.PUBBLICA_WEB_PASSWORD,
      isDev: data.NODE_ENV === "development",
      showDatabaseLogs: data.SHOW_DATABASE_LOGS === "true",
    };
  });

export const serverEnv = serverEnvSchema.parse(process.env);
