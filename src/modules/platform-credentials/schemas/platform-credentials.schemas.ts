import { z } from "zod";

export const SupportedPlatforms = z.enum([
    "github",
    "gitlab",
    "jira",
    "easyredmine",
    "youtrack",
]);

export const platformCredentialsFormSchema = z.object({
    platform: SupportedPlatforms,
    name: z.string(),
    persistentToken: z.string(),
    endpoint: z.url(),
    organizationId: z.string(),
    employeeId: z.string().optional(),
    projectId: z.string().optional(),
});

export const platformCredentialsInsertSchema = z.object({
    platform: SupportedPlatforms,
    name: z.string(),
    persistentToken: z.string(),
    endpoint: z.url(),
    organizationId: z
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

export type PlatformCredentialsInsert = z.infer<
    typeof platformCredentialsInsertSchema
>;

export type PlatformCredentialsValidForm = z.infer<
    typeof platformCredentialsFormSchema
>;

export const platformCredentialsReadSchema = z.object({
    id: z.number(),
    platform: SupportedPlatforms,
    name: z.string(),
    persistentToken: z.string(),
    employeeId: z.number().nullable(),
    projectId: z.number().nullable(),
    endpoint: z.url(),
});
export type PlatformCredentialsRead = z.infer<
    typeof platformCredentialsReadSchema
>;
