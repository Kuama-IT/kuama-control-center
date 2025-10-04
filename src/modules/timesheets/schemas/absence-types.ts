import { z } from "zod";

// Base schemas for absence data
export const AbsenceReasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
});

export const AbsenceDaySchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  date: z.string().nullable(),
  description: z.string().nullable(),
  reasonCode: z.string().nullable(),
  duration: z.string().nullable(),
  pending: z.boolean().nullable(),
  timeStart: z.string().nullable(),
  timeEnd: z.string().nullable(),
});

// Extended types that include joined data from database queries
export type AbsenceDayWithEmployee = {
  absence_days: {
    id: number;
    employeeId: number;
    date: string | null;
    description: string | null;
    reasonCode: string | null;
    duration: string | null;
    pending: boolean | null;
    timeStart: string | null;
    timeEnd: string | null;
  };
  employees: {
    id: number;
    email: string | null;
    name: string | null;
    surname: string | null;
    birthdate: string | null;
    fullName: string | null;
    avatarUrl: string | null;
    dipendentiInCloudId: string | null;
    hiredOn: string | null;
    nationalInsuranceNumber: string | null;
    phoneNumber: string | null;
    iban: string | null;
    payrollRegistrationNumber: number | null;
  } | null;
};

export type AbsenceReason = z.infer<typeof AbsenceReasonSchema>;

// Lists for server responses
export type AbsenceDaysList = AbsenceDayWithEmployee[];
export type AbsenceReasonList = AbsenceReason[];