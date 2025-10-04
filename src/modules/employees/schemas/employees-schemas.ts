import { z } from "zod";

// New canonical schema name (keep legacy alias below while migrating)
export const employeesReadSchema = z.object({
  id: z.number(),
  email: z.email().nullable(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  fullName: z.string().nullable(),
  birthdate: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  iban: z.string().nullable(),
  nationalInsuranceNumber: z.string().nullable(),
  dipendentiInCloudId: z.string().nullable(),
  hiredOn: z.string().nullable(),
  payrollRegistrationNumber: z.number().nullable(),
});

export type EmployeesRead = z.infer<typeof employeesReadSchema>;

// Legacy aliases (to be removed after full migration)
export const kEmployeesReadSchema = employeesReadSchema;
export type KEmployeesRead = EmployeesRead;
