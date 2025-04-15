import { z } from "zod";

export const kEmployeesReadSchema = z.object({
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

export type KEmployeesRead = z.infer<typeof kEmployeesReadSchema>;
