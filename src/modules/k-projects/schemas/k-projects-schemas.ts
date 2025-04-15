import { z } from "zod";
import { KTaskRead } from "@/modules/k-tasks/schemas/k-tasks-schemas";
import { KEmployeesRead } from "@/modules/k-employees/schemas/k-employees-schemas";

export const kProjectsReadSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  clientId: z.number(),
  youTrackRingId: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});
export type KProjectsRead = z.infer<typeof kProjectsReadSchema>;
export type KProjectsReadFull = KProjectsRead & { kTasks: KTaskRead[] } & {
  kTeams: KTeamWithEmployeeRead[];
  kProjectMedias: KProjectMediaRead[];
};

export const kTeamReadSchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  projectId: z.number(),
});
export const kProjectMediasReadSchema = z.object({
  id: z.number(),
  url: z.string().nullable(),
  projectId: z.number(),
});

export type KTeamRead = z.infer<typeof kTeamReadSchema>;
export type KTeamWithEmployeeRead = KTeamRead & { kEmployee: KEmployeesRead };
export type KProjectMediaRead = z.infer<typeof kProjectMediasReadSchema>;
