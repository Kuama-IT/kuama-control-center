import { z } from "zod";

const makePagedResponseSchema = <T>(schema: z.ZodType<T>) =>
  z.object({
    current_page: z.number(),
    data: z.array(schema),
    next_page_url: z.string().nullable(),
    path: z.string(),
    per_page: z.number(),
    prev_page_url: z.string().nullable(),
    to: z.number(),
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

export type DipendentiInCloudEmployee = z.infer<
  typeof dipendentiInCloudEmployeeSchema
>;

export const dipendentiInCloudEmployeesSchema = makePagedResponseSchema(
  dipendentiInCloudEmployeeSchema,
);

export const dipendentiInCloudTimesheetDaySchema = z.object({
  closed: z.boolean().optional(),
  disabled: z.boolean(),
  error: z.unknown().optional(),
  hours_type: z.string().optional(), // looks like an enum, one of the values is "fixed"
  locked: z.boolean(),
  note: z.boolean().optional(),
  presence: z
    .object({
      by_contract: z.number(),
      calculated: z.number(),
      duration: z.number(),
      duration_pending: z.number().nullable(),
    })
    .optional(),
  reasons: z
    .array(
      z.object({
        reason: z.object({
          id: z.number(),
          code: z.string(), // TODO seems like an enum, one of the values is F
          name: z.string(),
          color: z.string(),
          category: z.string(), // TODO seems like an enum, one of the values is absence
        }),
        duration: z.number().nullable(),
        duration_pending: z.number().nullable(),
        shifts: z
          .array(
            z.object({
              duration: z.number().nullable(),
              duration_pending: z.number().nullable(),
              time_start: z.string(),
              time_end: z.string(),
            }),
          )
          .nullable(),
      }),
    )
    .optional(),
});

const dipendentiInCloudEmployeeTimesheetSchema = z.record(
  z.string(), // date in format "yyyy-MM-dd"
  dipendentiInCloudTimesheetDaySchema,
);

const dipendentiInCloudTimesheetSchema = z.record(
  z.string(), // employee id
  dipendentiInCloudEmployeeTimesheetSchema,
);

export const dipendentiInCloudTimesheetResponseSchema = z.object({
  data: z.object({ timesheet: dipendentiInCloudTimesheetSchema }),
});

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

// these types are not used to parse other endpoint responses, just to build our internal stuff
export type Salary = {
  date: string;
  net: number;
  url: string;
};
export type SalaryWithGross = Salary & { gross: number };
export type SalaryByYear = {
  [key in number]: Salary[];
};
export type SalaryWithGrossByYear = {
  [key in number]: SalaryWithGross[];
};
export type EmployeeSalaryHistory = {
  name: string;
  salaries: SalaryByYear;
};
export type EmployeeSalaryWithGrossHistory = {
  name: string;
  salaries: SalaryWithGrossByYear;
};
