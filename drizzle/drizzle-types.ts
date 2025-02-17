import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  kClients,
  kClientVats,
  kEmployees,
  kPlatformCredentials,
  kProjectMedias,
  kProjects,
  kTasks,
  kTeams,
} from "@/drizzle/schema";
import { z } from "zod";

export const kProjectsReadSchema = createSelectSchema(kProjects);
export const kClientReadSchema = createSelectSchema(kClients);
export const kTaskReadSchema = createSelectSchema(kTasks);
export const kTeamReadSchema = createSelectSchema(kTeams);
export const kEmployeesReadSchema = createSelectSchema(kEmployees);
export const kProjectMediasReadSchema = createSelectSchema(kProjectMedias);
export type KTeamRead = z.infer<typeof kTeamReadSchema>;
export type KTeamWithEmployeeRead = KTeamRead & { kEmployee: KEmployeesRead };
export type KTaskRead = z.infer<typeof kTaskReadSchema>;
export type KProjectsRead = z.infer<typeof kProjectsReadSchema>;
export type KEmployeesRead = z.infer<typeof kEmployeesReadSchema>;
export type KProjectMediaRead = z.infer<typeof kProjectMediasReadSchema>;
export type KProjectsReadFull = KProjectsRead & { kTasks: KTaskRead[] } & {
  kTeams: KTeamWithEmployeeRead[];
  kProjectMedias: KProjectMediaRead[];
};
export type KClientRead = z.infer<typeof kClientReadSchema>;

export const kPlatformCredentialsFormSchema =
  createInsertSchema(kPlatformCredentials);
export type KPlatformCredentialsInsert = z.infer<
  typeof kPlatformCredentialsFormSchema
>;

export const kPlatformCredentialsReadSchema =
  createSelectSchema(kPlatformCredentials);
export type KPlatformCredentialsRead = z.infer<
  typeof kPlatformCredentialsReadSchema
>;

export const kClientVatsSchema = createSelectSchema(kClientVats);
export type KClientVatRead = z.infer<typeof kClientVatsSchema>;
