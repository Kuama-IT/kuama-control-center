"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSync } from "react-icons/fa";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCreateAccessTokenMutation } from "@/modules/access-tokens/mutations/access-tokens.mutations";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

const formSchema = z
    .object({
        purpose: z.string().min(1, "Purpose is required"),
        allowedUsages: z.number(),
        expires: z.boolean(),
        canBeUsedForInfinity: z.boolean(),
        expiresAt: z.date().optional(),
    })
    .superRefine((values, ctx) => {
        // token must either:
        // - be infinite
        // - have a max usage count
        // - have an expiration date
        if (
            !(
                values.canBeUsedForInfinity ||
                values.expires ||
                values.allowedUsages
            )
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Either allowed usages, expiration date or infinite usage must be specified",
            });
        }
    });

type FormData = z.infer<typeof formSchema>;

export const AccessTokenCreateForm = () => {
    const router = useRouter();
    const { mutateAsync, isPending } = useCreateAccessTokenMutation();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            purpose: "",
            allowedUsages: 0,
            expires: false,
            canBeUsedForInfinity: true,
            expiresAt: undefined,
        },
    });

    const watchInfinity = form.watch("canBeUsedForInfinity");
    const watchExpires = form.watch("expires");

    useEffect(() => {
        const { canBeUsedForInfinity, expires } = form.getValues();

        if (canBeUsedForInfinity) {
            form.setValue("allowedUsages", -1);
            form.setValue("expires", false);
            form.setValue("expiresAt", undefined);
            return;
        }

        if (expires) {
            form.setValue("allowedUsages", -1);
            form.setValue("canBeUsedForInfinity", false);
        }
    }, [form]);

    const onSubmit = async (values: FormData) => {
        try {
            const res = await mutateAsync({
                purpose: values.purpose,
                expiresAt: values.expiresAt ?? null,
                allowedUsages: values.allowedUsages,
            });

            notifySuccess(res.message);
            router.refresh();
        } catch (error) {
            const message =
                typeof error === "object" &&
                error !== null &&
                "message" in error
                    ? String((error as { message: string }).message)
                    : "Error while creating access token, check server logs";
            notifyError(message);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 rounded-lg px-4 py-8 shadow-lg"
            >
                <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{"Purpose"}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="API Access for..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="canBeUsedForInfinity"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>{"Unlimited usage"}</FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!(watchInfinity || watchExpires) && (
                    <FormField
                        control={form.control}
                        name="allowedUsages"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{"Max usage count"}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {!watchInfinity && (
                    <FormField
                        control={form.control}
                        name="expires"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>{"Token should expire"}</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {watchExpires && (
                    <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{"Expiry"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground",
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>{"Pick a date"}</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button
                    size="lg"
                    type="submit"
                    disabled={isPending || !form.formState.isValid}
                >
                    {isPending && <FaSync />}
                    {"Create Token"}
                </Button>
            </form>
        </Form>
    );
};
