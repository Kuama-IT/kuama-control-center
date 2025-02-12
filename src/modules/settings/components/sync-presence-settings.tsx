"use client";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import { useState, useTransition } from "react";
import syncDipendentiInCloudTimesheet from "@/modules/sync-data/actions/sync-dipendenti-in-cloud-timesheet-action";
import { Button } from "@/components/ui/button";

export const SyncPresenceSettings = () => {
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
    <div className="p-4 border rounded-lg">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          startTransition(async () => {
            if (range?.to === undefined || range?.from === undefined) {
              return;
            }
            await syncDipendentiInCloudTimesheet({
              to: range.to,
              from: range.from,
            });
          });
        }}
      >
        <Calendar mode="range" onSelect={setRange} selected={range} />

        <Button
          size="lg"
          disabled={
            isPending || range?.from === undefined || range?.to === undefined
          }
        >
          Sync employee presence information
        </Button>
      </form>
    </div>
  );
};
