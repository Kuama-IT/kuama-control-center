import { relations } from "drizzle-orm/relations";
import {
  employees,
  teams,
  projects,
  projectMedias,
  payslips,
  tasks,
  spentTimes,
  clients,
  absenceDays,
  vats,
  invoices,
  platformCredentialsToEmployeesAndProjects,
  platformCredentials,
  invoiceProjects,
  presenceDays,
  projectDailyRates,
  projectMonthlyRates,
  clientsVats,
} from "./schema";

export const teamRelations = relations(teams, ({ one }) => ({
  employee: one(employees, {
    fields: [teams.employeeId],
    references: [employees.id],
  }),
  project: one(projects, {
    fields: [teams.projectId],
    references: [projects.id],
  }),
}));

export const employeesRelations = relations(employees, ({ many }) => ({
  teams: many(teams),
  payslips: many(payslips),
  tasks: many(tasks),
  absenceDays: many(absenceDays),
  platformCredentialsToEmployeesAndProjects: many(
    platformCredentialsToEmployeesAndProjects
  ),
  presenceDays: many(presenceDays),
  projectDailyRates: many(projectDailyRates),
}));

export const projectRelations = relations(projects, ({ one, many }) => ({
  teams: many(teams),
  projectMedias: many(projectMedias),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  tasks: many(tasks),
  platformCredentialsToEmployeesAndProjects: many(
    platformCredentialsToEmployeesAndProjects
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

export const payslipsRelations = relations(payslips, ({ one }) => ({
  employee: one(employees, {
    fields: [payslips.employeeId],
    references: [employees.id],
  }),
}));

export const spentTimesRelations = relations(spentTimes, ({ one }) => ({
  kTask: one(tasks, {
    fields: [spentTimes.taskId],
    references: [tasks.id],
  }),
}));

export const taskRelations = relations(tasks, ({ one, many }) => ({
  spentTimes: many(spentTimes),
  kEmployee: one(employees, {
    fields: [tasks.employeeId],
    references: [employees.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const clientRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
  clientsVats: many(clientsVats),
}));

export const absenceDaysRelations = relations(absenceDays, ({ one }) => ({
  kEmployee: one(employees, {
    fields: [absenceDays.employeeId],
    references: [employees.id],
  }),
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  kVat: one(vats, {
    fields: [invoices.vat],
    references: [vats.id],
  }),
  invoiceProjects: many(invoiceProjects),
}));

export const vatsRelations = relations(vats, ({ many }) => ({
  invoices: many(invoices),
  clientsVats: many(clientsVats),
}));

export const platformCredentialsToEmployeesAndProjectsRelations = relations(
  platformCredentialsToEmployeesAndProjects,
  ({ one }) => ({
    kEmployee: one(employees, {
      fields: [platformCredentialsToEmployeesAndProjects.employeeId],
      references: [employees.id],
    }),
    kPlatformCredential: one(platformCredentials, {
      fields: [platformCredentialsToEmployeesAndProjects.platformCredentialsId],
      references: [platformCredentials.id],
    }),
    project: one(projects, {
      fields: [platformCredentialsToEmployeesAndProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const platformCredentialsRelations = relations(
  platformCredentials,
  ({ many }) => ({
    platformCredentialsToEmployeesAndProjects: many(
      platformCredentialsToEmployeesAndProjects
    ),
  })
);

// employeeEstimatedCosts table removed in schema refactor; relations deleted.

export const invoiceProjectsRelations = relations(
  invoiceProjects,
  ({ one }) => ({
    kInvoice: one(invoices, {
      fields: [invoiceProjects.invoiceId],
      references: [invoices.id],
    }),
    project: one(projects, {
      fields: [invoiceProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const presenceDaysRelations = relations(presenceDays, ({ one }) => ({
  kEmployee: one(employees, {
    fields: [presenceDays.employeeId],
    references: [employees.id],
  }),
}));

export const projectDailyRatesRelations = relations(
  projectDailyRates,
  ({ one }) => ({
    kEmployee: one(employees, {
      fields: [projectDailyRates.employee],
      references: [employees.id],
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

export const clientsVatsRelations = relations(clientsVats, ({ one }) => ({
  kClient: one(clients, {
    fields: [clientsVats.clientId],
    references: [clients.id],
  }),
  kVat: one(vats, {
    fields: [clientsVats.vatId],
    references: [vats.id],
  }),
}));
