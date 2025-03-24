"use client";
import { Title } from "@/modules/ui/components/title";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { FormEvent, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import syncDipendentiInCloudTimesheet from "@/modules/dipendenti-in-cloud/actions/sync-dipendenti-in-cloud-timesheet-action";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaCalendar, FaSync } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import syncDipendentiInCloudEmployees from "@/modules/dipendenti-in-cloud/actions/dic-import-action";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { cn } from "@/lib/utils";

export default function SyncDipendentiInCloud() {
  const today = new Date();
  const firstDateRange = startOfMonth(today);
  const lastDateRange = endOfMonth(today);
  const initialRange = {
    from: firstDateRange,
    to: lastDateRange,
  };
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border rounded-lg p-4">
      <Title>Dipendenti in cloud</Title>

      <div className="flex flex-col gap-8 items-center">
        <SyncTimesheetForm />
        <Separator />
        <SyncEmployeeData />
      </div>
    </div>
  );
}

const SyncEmployeeData = () => {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    startTransition(async () => {
      const res = await syncDipendentiInCloudEmployees();
      if (isFailure(res)) {
        notifyError("Error while syncing dipendenti in cloud general info");
        return;
      }

      notifySuccess(res.message);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Button disabled={isPending} size="lg">
        <FaSync className={cn({ "animate-spin": isPending })} />
        Sync employees general information
      </Button>
    </form>
  );
};

const SyncTimesheetForm = () => {
  const today = new Date();
  const firstDateRange = startOfMonth(today);
  const lastDateRange = endOfMonth(today);
  const initialRange = {
    from: firstDateRange,
    to: lastDateRange,
  };
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    startTransition(async () => {
      if (range?.to === undefined || range?.from === undefined) {
        return;
      }
      const res = await syncDipendentiInCloudTimesheet({
        to: range.to,
        from: range.from,
      });
      if (isFailure(res)) {
        notifyError("Error while syncing dipendenti in cloud timesheet");
        return;
      }

      notifySuccess("Dipendenti in cloud timesheet synced");
    });
  };
  return (
    <form className="flex flex-col gap-2 items-center" onSubmit={onSubmit}>
      <Calendar
        today={today}
        mode="range"
        onSelect={setRange}
        selected={range}
      />

      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          disabled={
            isPending || range?.from === undefined || range?.to === undefined
          }
        >
          {isPending ? <FaSync className="animate-spin" /> : <FaCalendar />}
          Sync employee presence information
        </Button>
        {range && range?.from && range?.to && (
          <p className="italic text-sm flex gap-2 items-center justify-center">
            {format(range.from, "dd-MM-yyyy")}
            <FaArrowRight />
            {format(range.to, "dd-MM-yyyy")}
          </p>
        )}
      </div>
    </form>
  );
};
