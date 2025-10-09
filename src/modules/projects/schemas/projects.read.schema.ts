import { z } from "zod";
import { TaskRead } from "@/modules/tasks/schemas/tasks-schemas";
import { EmployeesRead } from "@/modules/employees/schemas/employees-read";

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
export type ProjectReadExtended = ProjectRead & { tasks: TaskRead[] } & {
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
export type TeamWithEmployeeRead = TeamRead & { employee: EmployeesRead };
export type ProjectMediaRead = z.infer<typeof projectMediaReadSchema>;
