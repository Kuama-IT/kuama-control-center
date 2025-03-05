"use client";
import { KPlatformCredentialsRead } from "@/drizzle/drizzle-types";
import { Badge } from "@/components/ui/badge";
import { SiJirasoftware, SiRedmine } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Copy, Trash } from "lucide-react";
import { FaArrowRight, FaDownload, FaSync } from "react-icons/fa";
import { copyToClipboard } from "@/modules/ui/ui-utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState, useTransition } from "react";
import deleteKPlatformCredentials from "@/modules/k-platform-credentials/actions/k-platform-credentials-delete-action";
import { useRouter } from "next/navigation";
import syncTimeSpentForClient from "@/modules/sync-data/actions/sync-time-spent-by-credentials-for-client";
import Link from "next/link";
import { isFailure } from "@/utils/server-action-utils";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { Separator } from "@/components/ui/separator";

export const KPlatformCredentialsCard = ({
  credentials,
}: {
  credentials: KPlatformCredentialsRead;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteCredentials = () => {
    startTransition(async () => {
      const res = await deleteKPlatformCredentials(credentials.id);
      if (isFailure(res)) {
        toast("Error during credentials deletion, check server logs", {
          className: "bg-error text-foreground",
        });
        return;
      }
      router.refresh();
    });
  };

  const syncData = () => {
    const { from, to } = range ?? {};
    if (!from || !to) {
      return;
    }
    toast("K1", {
      description: "Data sync will continue in background",
    });
    startTransition(async () => {
      await syncTimeSpentForClient(credentials.id, {
        from,
        to,
      });
    });
  };

  // TODO, we should just use location.origin, but Bless service cannot reach us in localhost...
  const url = `https://kuama-control-center.vercel.app/reports/easyredmine/${credentials.id}`;
  const fileName = `${credentials.name.toLowerCase().replaceAll(" ", "-")}-report.pdf`; // TODO we should use the name of the user from easyredmine

  const today = new Date();
  const firstDateRange = startOfMonth(today);
  const lastDateRange = endOfMonth(today);
  const initialRange = {
    from: firstDateRange,
    to: lastDateRange,
  };
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  return (
    <div className="rounded-lg shadow-sm p-8 flex flex-col items-start gap-4 bg-background overflow-hidden group">
      <Badge className="py-2 px-4 rounded-full min-w-14 uppercase flex gap-2">
        {credentials.platform === "jira" && (
          <SiJirasoftware className="h-6 w-6" />
        )}
        {credentials.platform === "easyredmine" && (
          <SiRedmine className="h-6 w-6" />
        )}
        {credentials.platform}
      </Badge>
      <h3 className="text-xl font-bold uppercase">{credentials.name}</h3>

      <div className="relative flex flex-col justify-center w-full">
        <span className="font-bold text-sm">Endpoint</span>
        <p className="mono text-lg text-foreground/80 tracking-wide text-ellipsis overflow-hidden w-4/5">
          {credentials.endpoint}
        </p>
        <Copy
          className="absolute right-0 translate-x-16 group-hover:translate-x-0 transition-all cursor-pointer"
          onClick={() => {
            copyToClipboard(credentials.endpoint);
            toast("K1", { description: "Endpoint copied to clipboard" });
          }}
        />
      </div>
      <div className="relative flex flex-col justify-center w-full">
        <span className="font-bold text-sm">Token</span>
        <p className="mono text-lg text-foreground/80 tracking-wide">
          ****************
        </p>
        <Copy
          className="absolute right-0 translate-x-16 group-hover:translate-x-0 transition-all cursor-pointer"
          onClick={() => {
            copyToClipboard(credentials.persistentToken);
            toast("K1", { description: "Token copied to clipboard" });
          }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-auto w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <FaSync /> Sync timesheet
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 flex flex-col gap-4"
            align="start"
          >
            <Calendar
              initialFocus
              defaultMonth={range?.from}
              numberOfMonths={2}
              today={today}
              mode="range"
              onSelect={setRange}
              selected={range}
            />

            <Separator />
            <div className="flex items-center pb-4 justify-center">
              <Button disabled={isPending} onClick={syncData}>
                Sync {format(range?.from ?? today, "dd-MM-yyyy")}
                <FaArrowRight />
                {format(range?.to ?? today, "dd-MM-yyyy")}{" "}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Link
          className="w-full"
          href={`/api/pdf?url=${url}&fileName=${fileName}`}
          target="_blank"
        >
          <Button className="w-full">
            <FaDownload />
            Download timesheet
          </Button>
        </Link>

        <Separator />

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-destructive text-destructive-foreground uppercase flex">
              <Trash />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-destructive">
                This action cannot be undone. This will permanently delete these
                credentials.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Nope, undo please
                </Button>
              </DialogClose>
              <Button disabled={isPending} onClick={() => deleteCredentials()}>
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
