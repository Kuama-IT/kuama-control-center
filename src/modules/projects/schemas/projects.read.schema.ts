import { z } from "zod";
import { KTaskRead } from "@/modules/k-tasks/schemas/k-tasks-schemas";
import { KEmployeesRead } from "@/modules/employees/schemas/employees-schemas";

export const projectReadSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  clientId: z.number(),
  youTrackRingId: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});
export type ProjectRead = z.infer<typeof projectReadSchema>;
export type ProjectReadExtended = ProjectRead & { tasks: KTaskRead[] } & {
  teams: TeamWithEmployeeRead[];
  projectMedias: ProjectMediaRead[];
};

export const teamReadSchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  projectId: z.number(),
});
export const projectMediaReadSchema = z.object({
  id: z.number(),
  url: z.string().nullable(),
  projectId: z.number(),
});
export type TeamRead = z.infer<typeof teamReadSchema>;
export type TeamWithEmployeeRead = TeamRead & { employee: KEmployeesRead };
export type ProjectMediaRead = z.infer<typeof projectMediaReadSchema>;
