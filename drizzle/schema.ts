import {
  AnyPgColumn,
  boolean,
  customType,
  date,
  foreignKey,
  integer,
  interval,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { sql, SQL } from "drizzle-orm";

const bytea = customType<{
  data: Buffer;
  default: false;
}>({
  dataType() {
    return "bytea";
  },
});

export const externalPlatforms = pgEnum("external_platforms", [
  "github",
  "gitlab",
  "jira",
  "easyredmine",
  "youtrack",
]);

// Used to fetch spent times data from the code repository to feed employee's statistics and timesheets
export const platformCredentials = pgTable("platform_credentials", {
  id: serial().primaryKey(),
  platform: externalPlatforms().notNull(),
  name: varchar({ length: 256 }).notNull(),
  persistentToken: text().notNull(),
  endpoint: varchar({ length: 500 }).notNull(),
});

export const platformCredentialsToEmployeesAndProjects = pgTable(
  "platform_credentials_relations",
  {
    platformCredentialsId: serial(),
    employeeId: serial(),
    projectId: serial(),
  },
  (table) => [
    foreignKey({
      columns: [table.platformCredentialsId],
      foreignColumns: [platformCredentials.id],
      name: "fk_platform_credential_id",
    }),
    foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employees.id],
      name: "fk_employee_id",
    }),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "fk_project_id",
    }),
  ],
);

export const invoices = pgTable("invoices", {
  id: serial().primaryKey(),
  vat: serial()
    .references(() => vats.id)
    .notNull(),
  subject: varchar({ length: 256 }).notNull(),
  amountNet: real().notNull().default(0),
  amountGross: real().notNull().default(0),
  amountVat: real().notNull().default(0),
  date: date().notNull(),
  dueDate: date().notNull(),
  externalId: varchar({ length: 256 }).notNull().unique(), // id from fatture in cloud
  number: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const invoiceProjects = pgTable("invoice_projects", {
  invoiceId: integer()
    .references(() => invoices.id)
    .notNull(),
  projectId: integer()
    .references(() => projects.id)
    .notNull(),
});

// Our clients can have more than one VAT number
export const vats = pgTable("vats", {
  id: serial().primaryKey(),
  vat: varchar({ length: 256 }).notNull().unique(),
  companyName: varchar({ length: 256 }).notNull(),
  fattureInCloudId: varchar({ length: 256 }),
});

export const clientsVats = pgTable(
  "clients_vats",
  {
    vatId: integer()
      .references(() => vats.id)
      .notNull(),
    clientId: integer()
      .references(() => clients.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.vatId, t.clientId] })],
);

export const clients = pgTable("clients", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  organizationId: integer().references(() => organizations.id),
});

export const organizations = pgTable("organizations", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  avatarUrl: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
});

// We can agree with the client to have a fixed daily rate for a project...
export const projectDailyRates = pgTable("project_daily_rates", {
  id: serial().primaryKey(),
  employee: integer()
    .references(() => employees.id)
    .notNull(),
  project: integer()
    .references(() => projects.id)
    .notNull(),
  rate: real().notNull(),
});

// ... or a fixed monthly rate
export const projectMonthlyRates = pgTable("project_monthly_rates", {
  id: serial().primaryKey(),
  project: integer()
    .references(() => projects.id)
    .notNull(),
  rate: real().notNull(),
});

// Used to keep an eye if company is loosing money on a project
// Normalized payslips (UI/analytics-facing)
export const payslips = pgTable(
  "payslips",
  {
    id: serial().primaryKey(),
    employeeId: serial().references(() => employees.id), // nullable until mapped
    year: integer().notNull(),
    month: integer().notNull(),
    gross: real().notNull(),
    net: real().notNull(),
    businessCost: real(), // nullable until monthly balance allocation
    oneri: real(), // nullable until monthly balance allocation
    quota: real(), // nullable until monthly balance allocation
    workedDays: real().notNull().default(0),
    workedHours: real().notNull().default(0),
    permissionsHoursBalance: real().notNull().default(0),
    holidaysHoursBalance: real().notNull().default(0),
    rolHoursBalance: real().notNull().default(0),
    payrollRegistrationNumber: integer().notNull().default(0),
    documentId: integer()
      .references(() => documents.id)
      .notNull(), // single-page PDF document
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [
    unique("payslips_emp_year_month_unique").on(t.employeeId, t.year, t.month),
  ],
);

export const employees = pgTable("employees", {
  id: serial().primaryKey(),
  email: varchar({ length: 256 }).unique(), // key for external services like dipendenti in cloud, gitlab, github..
  name: varchar({ length: 256 }),
  surname: varchar({ length: 256 }),
  birthdate: date(),
  fullName: varchar({ length: 256 }),
  avatarUrl: text(),
  dipendentiInCloudId: varchar({ length: 256 }).unique(),
  hiredOn: date(),
  phoneNumber: varchar({ length: 256 }),
  iban: varchar({ length: 256 }),
  payrollRegistrationNumber: integer(),
  cf: varchar({ length: 16 }),
});

// Used to generate the legend of the report for our payrolls consultant
export const absenceReasons = pgTable(
  "absence_reasons",
  {
    id: serial().primaryKey(),
    code: varchar({ length: 256 }).notNull(),
    name: varchar({ length: 256 }).notNull(),
  },
  (t) => [unique("code_name").on(t.code, t.name)],
);

export const closures = pgTable(
  "closures",
  {
    id: serial().primaryKey(),
    day: integer().notNull(),
    month: integer().notNull(),
    year: integer(),
    description: varchar({ length: 256 }),
  },
  (t) => [unique("day_month_year").on(t.day, t.month, t.year)],
);

// Help to understand who is working this week
export const absenceDays = pgTable("absence_days", {
  id: serial().primaryKey(),
  date: date(),
  employeeId: integer()
    .references(() => employees.id)
    .notNull(),
  description: text(),
  reasonCode: varchar({ length: 256 }),
  duration: interval({ fields: "minute" }),
  pending: boolean(),
  timeStart: varchar(),
  timeEnd: varchar(),
});

// Help to understand who is working this week and forecast monthly employee costs / project costs
export const presenceDays = pgTable("presence_days", {
  id: serial().primaryKey(),
  date: date(),
  employeeId: integer()
    .references(() => employees.id)
    .notNull(),
  duration: interval({ fields: "minute" }),
});

export const projects = pgTable("projects", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  youTrackRingId: varchar({ length: 256 }).unique(),
  clientId: serial().references(() => clients.id),
  endDate: date(),
  startDate: date(),
  salePrice: real().default(0),
});

// Payment schedule for projects - tracks how the total project price will be divided over future months
export const projectPaymentSchedule = pgTable("project_payment_schedule", {
  id: serial().primaryKey(),
  projectId: integer()
    .references(() => projects.id)
    .notNull(),
  amount: real().notNull(),
  dueDate: date().notNull(),
  description: text(),
  invoiceId: integer().references(() => invoices.id), // Reference to invoice when payment is invoiced
  cashFlowEntryId: integer().references(() => cashFlowEntry.id), // Reference to cash flow entry when payment is received
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

// A nice gallery of what we did for the client
export const projectMedias = pgTable("project_medias", {
  id: serial().primaryKey(),
  url: text(),
  projectId: serial()
    .references(() => projects.id)
    .notNull(),
});

// Mainly used to generate reports
export const tasks = pgTable("tasks", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }),
  description: text(),
  platform: externalPlatforms().notNull(),
  externalTrackerId: varchar({ length: 256 }).unique(),
  projectId: integer()
    .references(() => projects.id)
    .notNull(),
  employeeId: integer()
    .references(() => employees.id)
    .notNull(),
  creationDate: date(),
});

// Used to generate reports and employee statistics
export const spentTimes = pgTable("spent_times", {
  id: serial().primaryKey(),
  duration: interval({ fields: "minute" }),
  date: date(),
  description: text(),
  platform: externalPlatforms().notNull(),
  externalTrackerId: varchar({ length: 256 }).unique(),
  taskId: integer()
    .references(() => tasks.id)
    .notNull(),
});

export const teams = pgTable("teams", {
  id: serial().primaryKey(),
  employeeId: integer()
    .references(() => employees.id)
    .notNull(),
  projectId: integer()
    .references(() => projects.id)
    .notNull(),
});

// Used to grant access temporarily to the site to user that do not have an account
export const accessTokens = pgTable("access_tokens", {
  id: serial().primaryKey(),
  token: varchar({ length: 256 }).notNull().unique(),
  purpose: varchar({ length: 256 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp(),
  allowedUsages: integer().default(-1), // no limits until expired
  usageCount: integer().default(0),
});

export const documents = pgTable(
  "documents",
  {
    id: serial().primaryKey(),
    content: bytea().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    sizeInBytes: integer().notNull(),
    sha256: varchar({ length: 64 }).notNull(),
    mime: varchar({ length: 128 }).notNull(),
    fileName: varchar({ length: 512 }),
    extension: varchar({ length: 16 }),
  },
  (t) => [unique("documents_sha256_unique").on(t.sha256)],
);

export const pubblicaWebPayslipSourceFiles = pgTable(
  "pubblica_web_payslip_source_files",
  {
    id: serial().primaryKey(),
    year: integer().notNull(),
    month: integer().notNull(),
    documentId: integer()
      .references(() => documents.id)
      .notNull(),
    importedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
  },
);

export const pubblicaWebPayslips = pgTable(
  "pubblica_web_payslips",
  {
    id: serial().primaryKey(),
    fullName: varchar({ length: 256 }).notNull(),
    year: integer().notNull(),
    month: integer().notNull(),
    birthDate: varchar({ length: 24 }).notNull(),
    hireDate: varchar({ length: 24 }).notNull(),
    cf: varchar({ length: 16 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    net: real().notNull(),
    gross: real().notNull(),
    workedDays: real().notNull().default(0),
    workedHours: real().notNull().default(0),
    permissionsHoursBalance: real().notNull().default(0),
    holidaysHoursBalance: real().notNull().default(0),
    rolHoursBalance: real().notNull().default(0),
    payrollRegistrationNumber: integer().notNull().default(0),
    documentId: integer()
      .references(() => documents.id)
      .notNull(),
  },
  (t) => [unique("fullName_year_month").on(t.fullName, t.year, t.month)],
);

export const pubblicaWebMonthlyBalances = pgTable(
  "pubblica_web_monthly_balances",
  {
    id: serial().primaryKey(),
    year: integer().notNull(),
    month: integer().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    total: real().notNull(),
    documentId: integer()
      .references(() => documents.id)
      .notNull(),
  },
  (t) => [unique("year_month").on(t.year, t.month)],
);

export const cashFlowCategoryType = pgEnum("cash_flow_category_type", [
  "income",
  "expense",
]);

export const cashFlowCategory = pgTable("cash_flow_category", {
  id: serial().primaryKey(),
  name: varchar({ length: 128 }).notNull(),
  type: cashFlowCategoryType().notNull(),
  description: text(),
});

export const cashFlowSubject = pgTable("cash_flow_subject", {
  id: serial().primaryKey(),
  name: varchar({ length: 128 }).notNull(),
  externalId: varchar({ length: 128 }),
});

export const cashFlowEntry = pgTable(
  "cash_flow_entry",
  {
    id: serial().primaryKey(),
    date: timestamp().notNull(),
    amount: real().notNull(),
    description: text(),
    extendedDescription: text(),
    categoryId: integer()
      .references(() => cashFlowCategory.id)
      .notNull(),
    subjectId: integer().references(() => cashFlowSubject.id),
    externalId: varchar({ length: 128 }),
    isIncome: boolean().notNull(),
  },
  (table) => [
    unique("cash_flow_entry_unique").on(
      table.date,
      table.amount,
      table.description,
      table.extendedDescription,
    ),
  ],
);

// Cash Flow Import (Excel) TODO move to documents
export const cashFlowImport = pgTable("cash_flow_import", {
  id: serial().primaryKey(),
  fileBase64: text().notNull(),
  fileName: varchar({ length: 256 }).notNull(),
  importedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
});

// Table to store bank account balance snapshots
export const cashFlowAccountBalance = pgTable("cash_flow_account_balance", {
  id: serial().primaryKey(),
  date: timestamp().notNull(), // When the balance was recorded
  balance: real().notNull(), // The balance amount
  source: text(), // Optional: manual, import, etc.
  note: text(), // Optional: any additional info
});

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
