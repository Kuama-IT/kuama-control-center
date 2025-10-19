"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    type BankStatementForm,
    bankStatementFormSchema,
} from "@/modules/cash-flow/schemas/bank-statement-form.schema";
import { notifySuccess } from "@/modules/ui/components/notify";
import { useCreateBankStatementMutation } from "../mutations/bank-statements.mutations";

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

    const id = useId();
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto flex max-w-md flex-col items-center space-y-6 rounded-lg bg-white p-6"
        >
            <div className="flex flex-col gap-2">
                <label className="flex-1 font-medium">
                    {"Bank Statement File"}
                </label>
                <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                        <label htmlFor={id} className="inline-block">
                            <span className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                                {field.value ? field.value.name : "Choose File"}
                            </span>
                            <input
                                id={id}
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
                    <span className="mt-1 text-red-600 text-xs">
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
