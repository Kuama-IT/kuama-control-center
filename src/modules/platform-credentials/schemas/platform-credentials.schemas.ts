import { z } from "zod";
import { EmployeesRead } from "@/modules/employees/schemas/employees-schemas";
import { ProjectRead } from "@/modules/projects/schemas/projects.read.schema";

export const SupportedPlatforms = z.enum([
  "github",
  "gitlab",
  "jira",
  "easyredmine",
  "youtrack",
]);

// Backward-compat export to ease migration from k- modules
export const KSupportedPlatforms = SupportedPlatforms;

export const platformCredentialsFormSchema = z.object({
  platform: SupportedPlatforms,
  name: z.string(),
  persistentToken: z.string(),
  endpoint: z.string().url(),
  clientId: z.string(),
  employeeId: z.string().optional(),
  projectId: z.string().optional(),
});

export const platformCredentialsInsertSchema = z.object({
  platform: SupportedPlatforms,
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
  endpoint: z.url(),
});
export type PlatformCredentialsRead = z.infer<
  typeof platformCredentialsReadSchema
>;

export type PlatformCredentialsFullRead = PlatformCredentialsRead & {
  employee?: EmployeesRead;
  project?: ProjectRead;
};

// Backward-compat type aliases for incremental migration
export type KPlatformCredentialsRead = PlatformCredentialsRead;
export type KPlatformCredentialsFullRead = PlatformCredentialsFullRead;
