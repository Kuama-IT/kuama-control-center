import {
  date,
  interval,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const codeRepositoryPlatform = pgEnum("code_repository_platform", [
  "github",
  "gitlab",
  "jira",
]);

// Currently represent either a set of organization/token to fetch data from GitHub, or a set of  endpoint/token to fetch data from GitLab
export const kPlatformCredentials = pgTable("k_platform_credentials", {
  id: serial().primaryKey(),
  platform: codeRepositoryPlatform().notNull(),
  name: varchar({ length: 256 }).notNull(),
  persistentToken: text().notNull(),
  endpoint: varchar({ length: 500 }).notNull(),
  clientId: serial()
    .references(() => kClients.id)
    .notNull(),
  projectId: serial().references(() => kProjects.id),
});

export const kClients = pgTable("k_clients", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  vat: varchar({ length: 256 }),
  avatarUrl: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
});

export const kPayrolls = pgTable("k_payrolls", {});
export const kEmployees = pgTable("k_employees", {
  id: serial().primaryKey(),
  email: varchar({ length: 256 }).unique(), // key for external services like dipendenti in cloud, gitlab, github..
  name: varchar({ length: 256 }),
  surname: varchar({ length: 256 }),
  birthdate: date(),
  fullName: varchar({ length: 256 }),
  avatarUrl: text(),
});

export const kTimesheetDays = pgTable("k_timesheet_days", {});

export const kProjects = pgTable("k_projects", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
  clientId: serial().references(() => kClients.id),
});

export const kProjectMedias = pgTable("k_project_medias", {
  id: serial().primaryKey(),
  url: text(),
  projectId: serial().references(() => kProjects.id),
});

export const kTasks = pgTable("k_tasks", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackId: varchar({ length: 256 }).unique(),
  projectId: serial().references(() => kProjects.id),
  employeeId: serial().references(() => kEmployees.id),
  creationDate: date(),
});

export const kSpentTimes = pgTable("k_spent_times", {
  id: serial().primaryKey(),
  duration: interval({ fields: "minute" }),
  date: date(),
  description: text(),
  youTrackId: varchar({ length: 256 }).unique(),
  taskId: serial().references(() => kTasks.id),
});

export const kTeams = pgTable("k_teams", {
  id: serial().primaryKey(),
  employeeId: serial().references(() => kEmployees.id),
  projectId: serial().references(() => kProjects.id),
});

export const kCommits = pgTable("k_commits", {});
export const kRepositories = pgTable("k_commits", {});
