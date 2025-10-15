import { z } from "zod";

export const bankStatementFormSchema = z.object({
    file: z
        .instanceof(File, { message: "File is required" })
        .refine(
            (file) =>
                file &&
                file.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            { message: "File must be an .xlsx file" },
        ),
});

export type BankStatementForm = z.infer<typeof bankStatementFormSchema>;
