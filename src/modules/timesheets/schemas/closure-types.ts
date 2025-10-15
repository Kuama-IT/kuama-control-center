import { z } from "zod";

// Base schema for closure data
export const ClosureSchema = z.object({
    id: z.number(),
    day: z.number(),
    month: z.number(),
    year: z.number().nullable(),
    description: z.string().nullable(),
});

// Extended type that includes computed date
export type ClosureWithDate = {
    id: number;
    day: number;
    month: number;
    year: number | null;
    description: string | null;
    date: Date;
};

export type Closure = z.infer<typeof ClosureSchema>;

// Lists for server responses
export type ClosuresList = ClosureWithDate[];
