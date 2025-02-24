import { relations } from "drizzle-orm/relations";
import {
  kEmployees,
  kTeams,
  kProjects,
  kProjectMedias,
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
  kInvoicesToProjects,
  kPresenceDays,
  kProjectDailyRates,
  kProjectsMonthlyRates,
  kClientsVats,
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
  kPayrolls: many(kPayrolls),
  kTasks: many(kTasks),
  kAbsenceDays: many(kAbsenceDays),
  kPlatformCredentialsToEmployeesAndProjects: many(
    kPlatformCredentialsToEmployeesAndProjects,
  ),
  kEmployeeEstimatedCosts: many(kEmployeeEstimatedCosts),
  kPresenceDays: many(kPresenceDays),
  kProjectDailyRates: many(kProjectDailyRates),
}));

export const kProjectsRelations = relations(kProjects, ({ one, many }) => ({
  kTeams: many(kTeams),
  kProjectMedias: many(kProjectMedias),
  kClient: one(kClients, {
    fields: [kProjects.clientId],
    references: [kClients.id],
  }),
  kTasks: many(kTasks),
  kPlatformCredentialsToEmployeesAndProjects: many(
    kPlatformCredentialsToEmployeesAndProjects,
  ),
  kInvoicesToProjects: many(kInvoicesToProjects),
  kProjectDailyRates: many(kProjectDailyRates),
  kProjectsMonthlyRates: many(kProjectsMonthlyRates),
}));

export const kProjectMediasRelations = relations(kProjectMedias, ({ one }) => ({
  kProject: one(kProjects, {
    fields: [kProjectMedias.projectId],
    references: [kProjects.id],
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
  kClientsVats: many(kClientsVats),
}));

export const kAbsenceDaysRelations = relations(kAbsenceDays, ({ one }) => ({
  kEmployee: one(kEmployees, {
    fields: [kAbsenceDays.employeeId],
    references: [kEmployees.id],
  }),
}));

export const kInvoicesRelations = relations(kInvoices, ({ one, many }) => ({
  kVat: one(kVats, {
    fields: [kInvoices.vat],
    references: [kVats.id],
  }),
  kInvoicesToProjects: many(kInvoicesToProjects),
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
    kProject: one(kProjects, {
      fields: [kPlatformCredentialsToEmployeesAndProjects.projectId],
      references: [kProjects.id],
    }),
  }),
);

export const kPlatformCredentialsRelations = relations(
  kPlatformCredentials,
  ({ many }) => ({
    kPlatformCredentialsToEmployeesAndProjects: many(
      kPlatformCredentialsToEmployeesAndProjects,
    ),
  }),
);

export const kEmployeeEstimatedCostsRelations = relations(
  kEmployeeEstimatedCosts,
  ({ one }) => ({
    kEmployee: one(kEmployees, {
      fields: [kEmployeeEstimatedCosts.employeeId],
      references: [kEmployees.id],
    }),
  }),
);

export const kInvoicesToProjectsRelations = relations(
  kInvoicesToProjects,
  ({ one }) => ({
    kInvoice: one(kInvoices, {
      fields: [kInvoicesToProjects.invoiceId],
      references: [kInvoices.id],
    }),
    kProject: one(kProjects, {
      fields: [kInvoicesToProjects.projectId],
      references: [kProjects.id],
    }),
  }),
);

export const kPresenceDaysRelations = relations(kPresenceDays, ({ one }) => ({
  kEmployee: one(kEmployees, {
    fields: [kPresenceDays.employeeId],
    references: [kEmployees.id],
  }),
}));

export const kProjectDailyRatesRelations = relations(
  kProjectDailyRates,
  ({ one }) => ({
    kEmployee: one(kEmployees, {
      fields: [kProjectDailyRates.employee],
      references: [kEmployees.id],
    }),
    kProject: one(kProjects, {
      fields: [kProjectDailyRates.project],
      references: [kProjects.id],
    }),
  }),
);

export const kProjectsMonthlyRatesRelations = relations(
  kProjectsMonthlyRates,
  ({ one }) => ({
    kProject: one(kProjects, {
      fields: [kProjectsMonthlyRates.project],
      references: [kProjects.id],
    }),
  }),
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
