"use client";
import { Title } from "@/modules/ui/components/title";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import syncDipendentiInCloudTimesheet from "@/modules/dipendenti-in-cloud/actions/sync-dipendenti-in-cloud-timesheet-action";
import syncDipendentiInCloudEmployees from "@/modules/dipendenti-in-cloud/actions/dipendenti-in-cloud-import-employees-action";
import syncDipendentiInCloudAbsenceReasonsAndClosures from "@/modules/dipendenti-in-cloud/actions/dipendenti-in-cloud-import-absence-reasons-and-closures";
import getNonExpiredToken from "@/modules/k-access-tokens/actions/k-access-token-get-not-expired";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaCalendar, FaEye, FaSync } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SyncDipendentiInCloud() {
  return (
    <div className="border rounded-lg p-4">
      <Title>Dipendenti in cloud</Title>

      <div className="flex flex-col gap-8 items-center">
        <SyncTimesheetForm />
        <Separator />
        <SyncEmployeeData />
        <Separator />
        <SyncAbsenceReasonsAndClosures />
        <Separator />
        <PreviewEmployeePresenceReport />
      </div>
    </div>
  );
}

const PreviewEmployeePresenceReport = () => {
  const syncButtonToggle = useRef<HTMLButtonElement>(null);

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const today = new Date();
  const firstDateRange = startOfMonth(today);
  const lastDateRange = endOfMonth(today);
  const initialRange = {
    from: firstDateRange,
    to: lastDateRange,
  };
  const [range, setRange] = useState<DateRange>(initialRange);

  const from = range?.from ? format(range.from, "dd-MM-yyyy") : "";
  const to = range?.to ? format(range.to, "dd-MM-yyyy") : "";
  const url = `${origin}/reports/dipendenti-in-cloud?from=${from}&to=${to}&accessToken=${accessToken}`;

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOrigin(location?.origin);
    startTransition(async () => {
      const kAccessToken = await getNonExpiredToken();
      if (!isFailure(kAccessToken)) {
        setAccessToken(kAccessToken.token);
      }
    });
  }, []);
  return (
    <Popover>
      <PopoverTrigger asChild>
        {isPending ? (
          <FaSync className="animate-spin" />
        ) : (
          <Button ref={syncButtonToggle}>
            <FaEye /> Preview presence report
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col gap-4" align="start">
        <Calendar
          initialFocus
          defaultMonth={range?.from}
          numberOfMonths={2}
          today={today}
          mode="range"
          onSelect={(range) => {
            if (range) {
              setRange(range);
            }
          }}
          selected={range}
        />

        <Separator />
        <div className="flex items-center p-4 justify-center">
          {range?.from && range?.to && (
            <Link
              className="w-full"
              href={url}
              target="_blank"
              onClick={() => {
                syncButtonToggle.current?.click();
              }}
            >
              <Button className="w-full">
                <FaEye />
                Preview presence report {format(range.from, "dd-MM-yyyy")}
                <FaArrowRight />
                {format(range.to, "dd-MM-yyyy")}
              </Button>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const SyncEmployeeData = () => {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    startTransition(async () => {
      const res = await syncDipendentiInCloudEmployees();
      if (isFailure(res)) {
        notifyError(
          "Error while syncing dipendenti in cloud employees general info",
        );
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

const SyncAbsenceReasonsAndClosures = () => {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    startTransition(async () => {
      const res = await syncDipendentiInCloudAbsenceReasonsAndClosures();
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
        Sync closures and absence reasons
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
