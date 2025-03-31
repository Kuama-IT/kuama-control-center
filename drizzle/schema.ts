import {
  AnyPgColumn,
  boolean,
  date,
  integer,
  interval,
  pgEnum,
  pgTable,
  primaryKey,
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

// Currently represent either a set of organization/token to fetch data from GitHub, or a set of endpoint/token to fetch data from GitLab
// Used to generate reports, and to fetch data from the code repository to feed employee's statistics
export const kPlatformCredentials = pgTable("k_platform_credentials", {
  id: serial().primaryKey(),
  platform: codeRepositoryPlatform().notNull(),
  name: varchar({ length: 256 }).notNull(),
  persistentToken: text().notNull(),
  endpoint: varchar({ length: 500 }).notNull(),
});

export const kPlatformCredentialsToEmployeesAndProjects = pgTable(
  "k_platform_credentials_to_employees_and_projects",
  {
    platformCredentialsId: serial().references(() => kPlatformCredentials.id),
    employeeId: serial().references(() => kEmployees.id),
    projectId: serial().references(() => kProjects.id),
  },
);

export const kInvoices = pgTable("k_invoices", {
  id: serial().primaryKey(),
  vat: serial()
    .references(() => kVats.id)
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

export const kInvoicesToProjects = pgTable("k_invoices_to_projects", {
  invoiceId: serial().references(() => kInvoices.id),
  projectId: serial().references(() => kProjects.id),
});

// Our clients can have more than one VAT number
export const kVats = pgTable("k_vats", {
  id: serial().primaryKey(),
  vat: varchar({ length: 256 }).notNull().unique(),
  companyName: varchar({ length: 256 }).notNull(),
  fattureInCloudId: varchar({ length: 256 }),
});

export const kClientsVats = pgTable(
  "k_clients_vats",
  {
    vatId: serial().references(() => kVats.id),
    clientId: serial().references(() => kClients.id),
  },
  (t) => [primaryKey({ columns: [t.vatId, t.clientId] })],
);

export const kClients = pgTable("k_clients", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  avatarUrl: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
});

// We can agree with the client to have a fixed daily rate for a project...
export const kProjectDailyRates = pgTable("k_project_daily_rates", {
  id: serial().primaryKey(),
  employee: serial().references(() => kEmployees.id),
  project: serial().references(() => kProjects.id),
  rate: real().notNull(),
});

// ... or a fixed monthly rate
export const kProjectsMonthlyRates = pgTable("k_projects_monthly_rates", {
  id: serial().primaryKey(),
  project: serial().references(() => kProjects.id),
  rate: real().notNull(),
});

// Used to keep an eye if company is loosing money on a project
export const kPayrolls = pgTable("k_payrolls", {
  id: serial().primaryKey(),
  employeeId: serial().references(() => kEmployees.id),
  net: real().notNull(),
  gross: real().notNull(),
  date: date().notNull(),
  payrollNumber: integer().notNull().default(0), // 1, 2, 3...13 (or 14 if we move to commercial sector)
  url: varchar({ length: 1500 }).notNull(),
  dipendentiInCloudPayrollId: varchar({ length: 256 }).unique(),
});

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
  nationalInsuranceNumber: varchar({ length: 256 }),
  phoneNumber: varchar({ length: 256 }),
  iban: varchar({ length: 256 }),
});

// Each month our employment consultant sends us a pdf file with the estimated costs for each employee
export const kEmployeeEstimatedCosts = pgTable("k_employee_estimated_costs", {
  id: serial().primaryKey(),
  employeeId: serial().references(() => kEmployees.id),
  estimatedYearCost: real(),
  estimatedMonthCost: real(),
  date: date().notNull(),
});

// Used to generate the legend of the report for our payrolls consultant
export const kAbsenceReasons = pgTable("k_absence_reasons", {
  id: serial().primaryKey(),
  code: varchar({ length: 256 }).notNull(),
  name: varchar({ length: 256 }).notNull(),
});

export const kClosures = pgTable("k_closures", {
  id: serial().primaryKey(),
  day: integer().notNull(),
  month: integer().notNull(),
  year: integer(),
  description: varchar({ length: 256 }),
});

// Help to understand who is working this week
export const kAbsenceDays = pgTable("k_absence_days", {
  id: serial().primaryKey(),
  date: date(),
  employeeId: serial().references(() => kEmployees.id),
  description: text(),
  reasonCode: varchar({ length: 256 }),
  duration: interval({ fields: "minute" }),
  pending: boolean(),
  timeStart: varchar(),
  timeEnd: varchar(),
});

// Help to understand who is working this week and forecast monthly employee costs / project costs
export const kPresenceDays = pgTable("k_presence_days", {
  id: serial().primaryKey(),
  date: date(),
  employeeId: serial().references(() => kEmployees.id),
  duration: interval({ fields: "minute" }),
});

export const kProjects = pgTable("k_projects", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
  clientId: serial().references(() => kClients.id),
  endDate: date(),
  startDate: date(),
});

// A nice gallery of what we did for the client
export const kProjectMedias = pgTable("k_project_medias", {
  id: serial().primaryKey(),
  url: text(),
  projectId: serial().references(() => kProjects.id),
});

// Mainly used to generate reports
export const kTasks = pgTable("k_tasks", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackId: varchar({ length: 256 }).unique(),
  projectId: serial().references(() => kProjects.id),
  employeeId: serial().references(() => kEmployees.id),
  creationDate: date(),
});

// Used to generate reports and employee statistics
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

// Used to grant access temporarily to the site to user that do not have an account
export const kAccessTokens = pgTable("k_access_tokens", {
  id: serial().primaryKey(),
  token: varchar({ length: 256 }).notNull().unique(),
  purpose: varchar({ length: 256 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp(),
  allowedUsages: integer().default(-1), // no limits until expired
  usageCount: integer().default(0),
});

// TODO
export const kCommits = pgTable("k_commits", {});
export const kRepositories = pgTable("k_repositories", {});

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
