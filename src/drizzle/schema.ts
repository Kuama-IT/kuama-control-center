import {
  date,
  interval,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const codeRepositoryPlatform = pgEnum("code_repository_platform", [
  "github",
  "gitlab",
]);

// Currently represent either a set of organization/token to fetch data from GitHub, or a set of  endpoint/token to fetch data from GitLab
export const kPlatformCredentials = pgTable("k_platform_credentials", {
  id: serial().primaryKey(),
  platform: codeRepositoryPlatform(),
  organization: varchar({ length: 256 }),
  persistentToken: text(),
  endpoint: varchar({ length: 500 }),
});

export const kClients = pgTable("k_clients", {});

export const kPayrolls = pgTable("k_payrolls", {});
// TODO relatedUserIds
export const kEmployees = pgTable("k_employees", {
  id: serial().primaryKey(),
  email: varchar({ length: 256 }).unique(), // key for external services like dipendenti in cloud, gitlab, github..
  name: varchar({ length: 256 }),
  surname: varchar({ length: 256 }),
  birthdate: date(),
  fullName: varchar({ length: 256 }),
  avatarUrl: text(),
});

export const kEmployeeRelations = relations(kEmployees, ({ many }) => {
  return {
    tasks: many(kTasks),
  };
});

export const kTimesheetDays = pgTable("k_timesheet_days", {});

export const kProjects = pgTable("k_projects", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
});

export const kTasks = pgTable("k_tasks", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackId: varchar({ length: 256 }).unique(),
  projectId: serial(),
  employeeId: serial(),
});

export const kSpentTimes = pgTable("k_spent_times", {
  id: serial().primaryKey(),
  duration: interval(),
  date: date(),
  description: text(),
  youTrackId: varchar({ length: 256 }).unique(),
  taskId: serial(),
});

export const kTasksRelations = relations(kTasks, ({ many }) => {
  return {
    kSpentTimes: many(kSpentTimes),
  };
});

export const kProjectsRelations = relations(kProjects, ({ many }) => {
  return {
    tasks: many(kTasks),
  };
});

export const kTeams = pgTable("k_teams", {});
export const kCommits = pgTable("k_commits", {});
export const kRepositories = pgTable("k_commits", {});
