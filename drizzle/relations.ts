import { relations } from "drizzle-orm/relations";
import {
  kClients,
  kClientVats,
  kEmployees,
  kProjectMedias,
  kProjects,
  kSpentTimes,
  kTasks,
  kTeams,
} from "./schema";

export const kTeamsRelations = relations(kTeams, ({ one }) => ({
  kEmployee: one(kEmployees, {
    fields: [kTeams.employeeId],
    references: [kEmployees.id],
  }),
  kProject: one(kProjects, {
    fields: [kTeams.projectId],
    references: [kProjects.id],
  }),
}));

export const kEmployeesRelations = relations(kEmployees, ({ many }) => ({
  kTeams: many(kTeams),
  kTasks: many(kTasks),
}));

export const kProjectsRelations = relations(kProjects, ({ one, many }) => ({
  kTeams: many(kTeams),
  kClient: one(kClients, {
    fields: [kProjects.clientId],
    references: [kClients.id],
  }),
  kTasks: many(kTasks),
  kProjectMedias: many(kProjectMedias),
}));

export const kSpentTimesRelations = relations(kSpentTimes, ({ one }) => ({
  kTask: one(kTasks, {
    fields: [kSpentTimes.taskId],
    references: [kTasks.id],
  }),
}));

export const kTasksRelations = relations(kTasks, ({ one, many }) => ({
  kSpentTimes: many(kSpentTimes),
  kEmployee: one(kEmployees, {
    fields: [kTasks.employeeId],
    references: [kEmployees.id],
  }),
  kProject: one(kProjects, {
    fields: [kTasks.projectId],
    references: [kProjects.id],
  }),
}));

export const kClientsRelations = relations(kClients, ({ many }) => ({
  kProjects: many(kProjects),
  kVats: many(kClientVats),
}));

export const kClientsVatsRelations = relations(kClientVats, ({ one }) => ({
  kClient: one(kClients, {
    fields: [kClientVats.clientId],
    references: [kClients.id],
  }),
}));

export const kProjectMediasRelations = relations(kProjectMedias, ({ one }) => ({
  kProject: one(kProjects, {
    fields: [kProjectMedias.projectId],
    references: [kProjects.id],
  }),
}));
