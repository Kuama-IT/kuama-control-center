import { relations } from "drizzle-orm/relations";
import {
  kEmployees,
  teams,
  projects,
  projectMedias,
  kPayrolls,
  kTasks,
  kSpentTimes,
  kClients,
  kAbsenceDays,
  kVats,
  kInvoices,
  kPlatformCredentialsToEmployeesAndProjects,
  kPlatformCredentials,
  kEmployeeEstimatedCosts,
  invoiceProjects,
  kPresenceDays,
  projectDailyRates,
  projectMonthlyRates,
  kClientsVats,
} from "./schema";

export const teamRelations = relations(teams, ({ one }) => ({
  employee: one(kEmployees, {
    fields: [teams.employeeId],
    references: [kEmployees.id],
  }),
  project: one(projects, {
    fields: [teams.projectId],
    references: [projects.id],
  }),
}));

export const kEmployeesRelations = relations(kEmployees, ({ many }) => ({
  teams: many(teams),
  kPayrolls: many(kPayrolls),
  kTasks: many(kTasks),
  kAbsenceDays: many(kAbsenceDays),
  kPlatformCredentialsToEmployeesAndProjects: many(
    kPlatformCredentialsToEmployeesAndProjects
  ),
  kEmployeeEstimatedCosts: many(kEmployeeEstimatedCosts),
  kPresenceDays: many(kPresenceDays),
  projectDailyRates: many(projectDailyRates),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  teams: many(teams),
  projectMedias: many(projectMedias),
  client: one(kClients, {
    fields: [projects.clientId],
    references: [kClients.id],
  }),
  kTasks: many(kTasks),
  kPlatformCredentialsToEmployeesAndProjects: many(
    kPlatformCredentialsToEmployeesAndProjects
  ),
  invoiceProjects: many(invoiceProjects),
  projectDailyRates: many(projectDailyRates),
  projectMonthlyRates: many(projectMonthlyRates),
}));

export const projectMediaRelations = relations(projectMedias, ({ one }) => ({
  project: one(projects, {
    fields: [projectMedias.projectId],
    references: [projects.id],
  }),
}));

export const kPayrollsRelations = relations(kPayrolls, ({ one }) => ({
  kEmployee: one(kEmployees, {
    fields: [kPayrolls.employeeId],
    references: [kEmployees.id],
  }),
}));

export const kSpentTimesRelations = relations(kSpentTimes, ({ one }) => ({
  kTask: one(kTasks, {
    fields: [kSpentTimes.taskId],
    references: [kTasks.id],
  }),
}));

export const taskRelations = relations(kTasks, ({ one, many }) => ({
  kSpentTimes: many(kSpentTimes),
  kEmployee: one(kEmployees, {
    fields: [kTasks.employeeId],
    references: [kEmployees.id],
  }),
  project: one(projects, {
    fields: [kTasks.projectId],
    references: [projects.id],
  }),
}));

export const clientRelations = relations(kClients, ({ many }) => ({
  projects: many(projects),
  kClientsVats: many(kClientsVats),
}));

export const kAbsenceDaysRelations = relations(kAbsenceDays, ({ one }) => ({
  kEmployee: one(kEmployees, {
    fields: [kAbsenceDays.employeeId],
    references: [kEmployees.id],
  }),
}));

export const invoiceRelations = relations(kInvoices, ({ one, many }) => ({
  kVat: one(kVats, {
    fields: [kInvoices.vat],
    references: [kVats.id],
  }),
  invoiceProjects: many(invoiceProjects),
}));

export const kVatsRelations = relations(kVats, ({ many }) => ({
  kInvoices: many(kInvoices),
  kClientsVats: many(kClientsVats),
}));

export const kPlatformCredentialsToEmployeesAndProjectsRelations = relations(
  kPlatformCredentialsToEmployeesAndProjects,
  ({ one }) => ({
    kEmployee: one(kEmployees, {
      fields: [kPlatformCredentialsToEmployeesAndProjects.employeeId],
      references: [kEmployees.id],
    }),
    kPlatformCredential: one(kPlatformCredentials, {
      fields: [
        kPlatformCredentialsToEmployeesAndProjects.platformCredentialsId,
      ],
      references: [kPlatformCredentials.id],
    }),
    project: one(projects, {
      fields: [kPlatformCredentialsToEmployeesAndProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const kPlatformCredentialsRelations = relations(
  kPlatformCredentials,
  ({ many }) => ({
    kPlatformCredentialsToEmployeesAndProjects: many(
      kPlatformCredentialsToEmployeesAndProjects
    ),
  })
);

export const kEmployeeEstimatedCostsRelations = relations(
  kEmployeeEstimatedCosts,
  ({ one }) => ({
    kEmployee: one(kEmployees, {
      fields: [kEmployeeEstimatedCosts.employeeId],
      references: [kEmployees.id],
    }),
  })
);

export const invoiceProjectsRelations = relations(
  invoiceProjects,
  ({ one }) => ({
    kInvoice: one(kInvoices, {
      fields: [invoiceProjects.invoiceId],
      references: [kInvoices.id],
    }),
    project: one(projects, {
      fields: [invoiceProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const kPresenceDaysRelations = relations(kPresenceDays, ({ one }) => ({
  kEmployee: one(kEmployees, {
    fields: [kPresenceDays.employeeId],
    references: [kEmployees.id],
  }),
}));

export const projectDailyRatesRelations = relations(
  projectDailyRates,
  ({ one }) => ({
    kEmployee: one(kEmployees, {
      fields: [projectDailyRates.employee],
      references: [kEmployees.id],
    }),
    project: one(projects, {
      fields: [projectDailyRates.project],
      references: [projects.id],
    }),
  })
);

export const projectMonthlyRatesRelations = relations(
  projectMonthlyRates,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectMonthlyRates.project],
      references: [projects.id],
    }),
  })
);

export const kClientsVatsRelations = relations(kClientsVats, ({ one }) => ({
  kClient: one(kClients, {
    fields: [kClientsVats.clientId],
    references: [kClients.id],
  }),
  kVat: one(kVats, {
    fields: [kClientsVats.vatId],
    references: [kVats.id],
  }),
}));
