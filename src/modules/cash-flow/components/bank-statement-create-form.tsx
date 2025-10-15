"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    bankStatementFormSchema,
    BankStatementForm,
} from "@/modules/cash-flow/schemas/bank-statement-form.schema";
import { useCreateBankStatementMutation } from "../mutations/bank-statements.mutations";
import { notifySuccess } from "@/modules/ui/components/notify";
import { useRouter } from "next/navigation";

export function BankStatementCreateForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<BankStatementForm>({
        resolver: zodResolver(bankStatementFormSchema),
    });
    const router = useRouter();

    const { mutate, isPending, progress } = useCreateBankStatementMutation();

    const onSubmit = (data: BankStatementForm) => {
        mutate(data, {
            onSuccess: () => {
                notifySuccess("Bank statement uploaded successfully");
                router.refresh();
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md flex flex-col items-center mx-auto p-6 bg-white rounded-lg space-y-6"
        >
            <div className="flex flex-col gap-2">
                <label className="font-medium flex-1">
                    Bank Statement File
                </label>
                <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                        <label htmlFor="file" className="inline-block">
                            <span className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                {field.value ? field.value.name : "Choose File"}
                            </span>
                            <input
                                id="file"
                                type="file"
                                accept=".xlsx"
                                className="hidden"
                                onChange={(e) =>
                                    field.onChange(e.target.files?.item(0))
                                }
                            />
                        </label>
                    )}
                />
                {errors.file && (
                    <span className="text-red-600 text-xs mt-1">
                        {errors.file.message}
                    </span>
                )}
            </div>

            <Button type="submit" className="w-md" disabled={isPending}>
                {isPending ? `Uploading... ${progress}%` : "Submit"}
            </Button>
        </form>
    );
}
