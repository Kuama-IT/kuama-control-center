import { z } from "zod";

const makePagedResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    current_page: z.number(),
    data: z.array(schema),
    next_page_url: z.string().nullable(),
    path: z.string(),
    per_page: z.number(),
    prev_page_url: z.string().nullable(),
    to: z.number().nullable(),
    total: z.number(),
  });

export const dipendentiInCloudEmployeeSchema = z.object({
  id: z.number(),
  person_id: z.number(),
  active: z.boolean(),
  job_title: z.string(),
  number: z.string().nullable(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  birth_date: z.string().nullable(),
  full_name: z.string(),
  current_contract: z.object({
    valid_from: z.string(),
  }),
});
export const dipendentiInCloudEmployeesSchema = makePagedResponseSchema(
  dipendentiInCloudEmployeeSchema,
);

export const dipendentiInCloudEmployeeDetailSchema =
  dipendentiInCloudEmployeeSchema.extend({
    iban: z.string().nullable(),
    phone_number: z.string().nullable(),
    tax_code: z.string().nullable(),
  });

export type DipendentiInCloudEmployeeDetail = z.infer<
  typeof dipendentiInCloudEmployeeDetailSchema
>;

export const dipendentiInCloudEmployeeDetailResponseSchema = z.object({
  data: dipendentiInCloudEmployeeDetailSchema,
});

// Justifications (Absences) schema - defined first so it can be used in timesheet
const justificationSchema = z.object({
  id: z.number(),
  employee_id: z.number(),
  date: z.string(), // "yyyy-MM-dd"
  legacy: z.number(),
  pending_legacy: z.number(),
  uid: z.number(),
  justification_type_id: z.number(),
  counter_id: z.number().nullable(),
  privacy: z.number(),
  ordinary_presence: z.number(),
  group_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  description: z.string().nullable(),
  paid: z.number(),
  presence_influencer: z.number(),
  presence_coverage: z.number(),
  category: z.string(), // e.g., "absence"
  code: z.string(), // e.g., "F"
  name: z.string(), // e.g., "Ferie"
  color: z.string(),
  group: z.string(), // e.g., "vacations"
  time_start: z.string().nullable(), // "yyyy-MM-dd HH:mm:ss"
  pending_time_start: z.string().nullable(),
  time_end: z.string().nullable(), // "yyyy-MM-dd HH:mm:ss"
  pending_time_end: z.string().nullable(),
  duration: z.number().nullable(), // in minutes
  duration_pending: z.number().nullable(),
  status: z.string(), // e.g., "approved"
  pending: z.number(),
  expired: z.boolean(),
});

const shiftSchema = z.object({
  date: z.string(), // "yyyy-MM-dd"
  reference_date: z.string(), // "yyyy-MM-dd"
  start: z.string(), // "HH:mm:ss"
  end: z.string(), // "HH:mm:ss"
  duration: z.number(), // in minutes
  pauses: z.array(z.unknown()),
});

const calculatedEntrySchema = z.object({
  date: z.string(), // "yyyy-MM-dd"
  reference_date: z.string(), // "yyyy-MM-dd"
  start: z.string(), // "HH:mm:ss"
  end: z.string(), // "HH:mm:ss"
  duration: z.number(), // in minutes
});

export const dipendentiInCloudTimesheetDaySchema = z.object({
  working_day: z.boolean(),
  holiday: z.unknown().nullable(),
  hours_type: z.string(), // e.g., "fixed"
  legacy: z.boolean(),
  employee_id: z.number(),
  date: z.string(), // "yyyy-MM-dd"
  shifts: z.array(shiftSchema),
  justifications: z.array(justificationSchema).optional(), // Now properly typed, optional because we merge it in
  calculated: z.array(calculatedEntrySchema),
  ordinary_presence: z.array(z.unknown()),
});

const dipendentiInCloudEmployeeTimesheetSchema = z.record(
  z.string(), // date in format "yyyy-MM-dd"
  dipendentiInCloudTimesheetDaySchema,
);

export const dipendentiInCloudTimesheetSchema = z.record(
  z.string(), // employee id
  dipendentiInCloudEmployeeTimesheetSchema,
);

export const dipendentiInCloudTimesheetResponseSchema = z.object({
  data: dipendentiInCloudTimesheetSchema,
});

// Export justifications response schema
export const dipendentiInCloudJustificationsResponseSchema = z.object({
  data: z.object({
    justifications: z.array(justificationSchema),
  }),
});

export type DipendentiInCloudJustification = z.infer<
  typeof justificationSchema
>;

const payrollSchema = z.object({
  id: z.number(),
  month: z.number(),
  year: z.number(),
  net: z.number(),
  date: z.string(),
  description: z.string(),
  balance_aligned: z.boolean(),
  read: z.boolean(),
  read_at: z.string().nullable(),
  balance: z.array(
    z.object({
      id: z.number(),
      previous_year: z.number().nullable(),
      maturation: z.number().nullable(),
      used: z.number().nullable(),
    }),
  ),
  attachments: z.array(
    z.object({
      id: z.number(),
      filename: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
      url: z.string(),
    }),
  ),
  employee: dipendentiInCloudEmployeeSchema.omit({
    current_contract: true,
    job_title: true,
    email: true,
    birth_date: true,
  }),
});

export const dipendentiInCloudPayrollsSchema =
  makePagedResponseSchema(payrollSchema);

export const absenceReasonSchema = z.object({
  category: z.string(),
  code: z.string(),
  name: z.string(),
  active: z.number(),
});

export const absenceReasonsResponseSchema = z.object({
  data: z.object({
    list: z.array(absenceReasonSchema),
  }),
});

export const closureSchema = z.object({
  day: z.number(),
  month: z.number(),
  year: z.number().nullable(),
  disabled_reason: z.string(),
});

export const closuresResponseSchema = makePagedResponseSchema(closureSchema);

// these types are not used to parse other endpoint responses, just to build our internal stuff
export type Salary = {
  date: string;
  net: number;
  url: string;
  dipendentiInCloudPayrollId: number;
};
export type SalaryWithGross = Salary & { gross: number };
export type SalaryByYear = {
  [key in number]: Salary[];
};
export type SalaryWithGrossByYear = {
  [key in number]: SalaryWithGross[];
};
export type EmployeeSalaryHistory = {
  employeeName: string;
  employeeId: number;
  salaries: SalaryByYear;
};
export type EmployeeSalaryWithGrossHistory = {
  employeeName: string;
  employeeId: number;
  salaries: SalaryWithGrossByYear;
};
