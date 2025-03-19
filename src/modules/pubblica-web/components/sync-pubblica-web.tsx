"use client";
import { Title } from "@/modules/ui/components/title";
import { format, setMonth } from "date-fns";
import { useTransition } from "react";
import syncPayrollsToDipendentiInCloudAction from "@/modules/pubblica-web/actions/sync-payrolls-to-dipendenti-in-cloud-action";
import { Button } from "@/components/ui/button";
import { FaCalendar } from "react-icons/fa";
import { isFailure } from "@/utils/server-action-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";

const months = Array.from({ length: 12 }, (_, i) => {
  const date = setMonth(new Date(), i);
  return {
    value: i,
    label: format(date, "MMMM"),
  };
});

const formSchema = z.object({
  month: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  year: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
});

type FormSchema = z.infer<typeof formSchema>;

export default function SyncPubblicaWeb() {
  const [isPending, startTransition] = useTransition();
  const date = new Date();
  const startOfBusinessYear = 2019;
  const currentYear = date.getFullYear();
  const years = Array.from(
    { length: currentYear - startOfBusinessYear + 1 },
    (_, i) => startOfBusinessYear + i,
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: date.getMonth(),
      year: date.getFullYear(),
    },
  });

  const onSubmit = (values: FormSchema) => {
    startTransition(async () => {
      const date = new Date();
      date.setFullYear(values.year);
      date.setMonth(values.month);

      const res = await syncPayrollsToDipendentiInCloudAction({
        date,
      });
      if (isFailure(res)) {
        notifyError("Error while syncing PubblicaWeb payrolls");
        return;
      }

      notifySuccess(
        "Payrolls synced, be sure to approve them on Dipendenti In Cloud",
      );
    });
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-8">
      <Title>PubblicaWeb</Title>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={date.getMonth().toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month to sync" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map(({ value, label }) => (
                        <SelectItem key={value} value={value.toString()}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={date.getFullYear().toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year to sync" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isPending || !form.formState.isValid}
          >
            <FaCalendar />
            Send employee payrolls to Dipendenti In Cloud
          </Button>
        </form>
      </Form>
    </div>
  );
}
