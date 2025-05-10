"use client";

import { Badge } from "@/components/ui/badge";
import { SiJirasoftware, SiRedmine } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  FaArrowRight,
  FaDownload,
  FaEye,
  FaLink,
  FaSync,
} from "react-icons/fa";
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

import { useRef, useState, useTransition } from "react";
import deleteKPlatformCredentials from "@/modules/k-platform-credentials/actions/k-platform-credentials-delete-action";
import { useRouter } from "next/navigation";
import syncTimeSpentForClient from "@/modules/sync-data/actions/sync-time-spent-by-credentials-for-client";
import Link from "next/link";
import { isFailure } from "@/utils/server-action-utils";
import { Calendar } from "@/components/ui/calendar";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { Separator } from "@/components/ui/separator";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { CopyButton } from "@/modules/ui/components/copy-button";
import { MdOutlineToken } from "react-icons/md";
import { KPlatformCredentialsFullRead } from "@/modules/k-platform-credentials/schemas/k-platform-credentials-schemas";
import { useDateRange } from "@/modules/ui/hooks/useDateRange";

export const KPlatformCredentialsCard = ({
  credentials,
}: {
  credentials: KPlatformCredentialsFullRead;
}) => {
  const canGenerateReport = credentials.platform === "easyredmine";

  return (
    <div className="rounded-lg shadow-sm p-8 flex flex-col items-start gap-4 bg-background overflow-hidden group">
      <div className="flex items-center gap-4">
        <Badge
          variant="secondary"
          className="py-2 px-4 rounded-full min-w-14 uppercase flex gap-2 items-center"
        >
          {credentials.platform === "jira" && (
            <SiJirasoftware className="h-6 w-6" />
          )}
          {credentials.platform === "easyredmine" && (
            <SiRedmine className="h-6 w-6" />
          )}
          <span className="text-xs"> {credentials.platform}</span>
        </Badge>
        <h3 className="font-bold uppercase text-sm">{credentials.name}</h3>

        {credentials.kProject && <p>{credentials.kProject.name}</p>}
        {credentials.kEmployee && <p>{credentials.kEmployee.fullName}</p>}
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <FaLink className="text-foreground/80" />
          <p className="mono text-lg text-foreground/80 tracking-wide text-ellipsis overflow-hidden w-4/5">
            {credentials.endpoint}
          </p>
          <CopyButton
            successMessage="Endpoint copied to clipboard"
            contentToCopy={credentials.endpoint}
          />
        </div>
        <div className="flex items-center gap-2">
          <MdOutlineToken className="text-foreground/80" />
          <p className="mono text-lg text-foreground/80 tracking-wide">
            ****************
          </p>

          <CopyButton
            successMessage="Token copied to clipboard"
            contentToCopy={credentials.persistentToken}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        {canGenerateReport && (
          <SyncTimesheetButton credentialsId={credentials.id} />
        )}

        {canGenerateReport && (
          <DownloadTimesheetButton credentials={credentials} />
        )}

        <div className="ml-auto">
          <DeleteButton credentialsId={credentials.id} />
        </div>
      </div>
    </div>
  );
};

const DownloadTimesheetButton = ({
  credentials,
}: {
  credentials: KPlatformCredentialsFullRead;
}) => {
  // TODO, we should just use location.origin, but Bless service cannot reach us in localhost...

  const reportName = credentials.kEmployee?.fullName ?? credentials.name;
  const fileName = `${reportName.toLowerCase().replaceAll(" ", "-")}-report.pdf`;

  const syncButtonToggle = useRef<HTMLButtonElement>(null);

  const { to, setRange, range, from, today } = useDateRange();

  const url = `https://kuama-control-center.vercel.app/reports/easyredmine?credentialsId=${credentials.id}&from=${from}&to=${to}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button ref={syncButtonToggle}>
          <FaSync /> Download timesheet
        </Button>
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
        <div className="flex items-center pb-4 justify-center gap-2">
          {range?.from && range?.to && (
            <>
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
                  Preview timesheet {format(range.from, "dd-MM-yyyy")}
                  <FaArrowRight />
                  {format(range.to, "dd-MM-yyyy")}
                </Button>
              </Link>

              <Link
                className="w-full"
                href={`/api/pdf?url=${url}&fileName=${fileName}`}
                target="_blank"
                onClick={() => {
                  syncButtonToggle.current?.click();
                }}
              >
                <Button className="w-full">
                  <FaDownload />
                  Download timesheet {format(range.from, "dd-MM-yyyy")}
                  <FaArrowRight />
                  {format(range.to, "dd-MM-yyyy")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DeleteButton = ({ credentialsId }: { credentialsId: number }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const deleteCredentials = () => {
    startTransition(async () => {
      const res = await deleteKPlatformCredentials(credentialsId);
      if (isFailure(res)) {
        notifyError("Error during credentials deletion, check server logs");
        return;
      }

      notifySuccess("Credentials deleted");
      router.refresh();
    });
  };

  return (
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
  );
};

const SyncTimesheetButton = ({ credentialsId }: { credentialsId: number }) => {
  const [isPending, startTransition] = useTransition();
  const syncButtonToggle = useRef<HTMLButtonElement>(null);

  const syncData = () => {
    const { from, to } = range ?? {};
    if (!from || !to) {
      return;
    }
    notifySuccess("Data sync will continue in background");
    startTransition(async () => {
      await syncTimeSpentForClient(credentialsId, {
        from,
        to,
      });
    });
    syncButtonToggle.current?.click();
  };

  const today = new Date();
  const firstDateRange = startOfMonth(today);
  const lastDateRange = endOfMonth(today);
  const initialRange = {
    from: firstDateRange,
    to: lastDateRange,
  };
  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button ref={syncButtonToggle}>
          <FaSync /> Sync timesheet
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col gap-4" align="start">
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
  );
};
