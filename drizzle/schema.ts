import {
  AnyPgColumn,
  boolean,
  date,
  integer,
  interval,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { sql, SQL } from "drizzle-orm";

export const codeRepositoryPlatform = pgEnum("code_repository_platform", [
  "github",
  "gitlab",
  "jira",
  "easyredmine",
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
});

export const kInvoices = pgTable("k_invoices", {
  id: serial().primaryKey(),
  clientVat: serial()
    .references(() => kClientVats.id)
    .notNull(),
  subject: varchar({ length: 256 }).notNull(),
  amountNet: real().notNull().default(0),
  amountGross: real().notNull().default(0),
  amountVat: real().notNull().default(0),
  date: date().notNull(),
  number: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const kClientVats = pgTable("k_client_vats", {
  id: serial().primaryKey(),
  vat: varchar({ length: 256 }).notNull(),
  companyName: varchar({ length: 256 }).notNull(),
  fattureInCloudId: varchar({ length: 256 }).unique(),
  clientId: serial()
    .references(() => kClients.id)
    .notNull(),
});

export const kClients = pgTable("k_clients", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
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
  dipendentiInCloudId: varchar({ length: 256 }).unique(),
  hiredOn: date(),
});

export const kAbsenceDays = pgTable("k_absence_days", {
  id: serial().primaryKey(),
  date: date(),
  employeeId: serial().references(() => kEmployees.id),
  description: text(),
  duration: interval({ fields: "minute" }),
  pending: boolean(),
  timeStart: varchar(),
  timeEnd: varchar(),
});

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

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
