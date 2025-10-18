"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { type DateRange } from "react-day-picker";
import {
    FaArrowRight,
    FaDownload,
    FaEye,
    FaLink,
    FaSync,
} from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";
import { SiJirasoftware, SiRedmine } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Separator } from "@/components/ui/separator";
import syncTimeSpentForClient from "@/modules/sync-data/actions/sync-time-spent-by-credentials-for-client";
import { CopyButton } from "@/modules/ui/components/copy-button";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { useDateRange } from "@/modules/ui/hooks/useDateRange";
import { isFailure } from "@/utils/server-action-utils";
import { deleteAction } from "../platform-credentials.actions";
import { type PlatformCredentialsFullRead } from "../schemas/platform-credentials.schemas";

export default function PlatformCredentialsCard({
    credentials,
}: {
    credentials: PlatformCredentialsFullRead;
}) {
    const canGenerateReport = credentials.platform === "easyredmine";

    return (
        <div className="group flex flex-col items-start gap-4 overflow-hidden rounded-lg bg-background p-8 shadow-sm">
            <div className="flex items-center gap-4">
                <Badge
                    variant="secondary"
                    className="flex min-w-14 items-center gap-2 rounded-full px-4 py-2 uppercase"
                >
                    {credentials.platform === "jira" && (
                        <SiJirasoftware className="h-6 w-6" />
                    )}
                    {credentials.platform === "easyredmine" && (
                        <SiRedmine className="h-6 w-6" />
                    )}
                    <span className="text-xs"> {credentials.platform}</span>
                </Badge>
                <h3 className="font-bold text-sm uppercase">
                    {credentials.name}
                </h3>

                {credentials.project && <p>{credentials.project.name}</p>}
                {credentials.employee && <p>{credentials.employee.fullName}</p>}
            </div>

            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <FaLink className="text-foreground/80" />
                    <p className="mono w-4/5 overflow-hidden text-ellipsis text-foreground/80 text-lg tracking-wide">
                        {credentials.endpoint}
                    </p>
                    <CopyButton
                        successMessage="Endpoint copied to clipboard"
                        contentToCopy={credentials.endpoint}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineToken className="text-foreground/80" />
                    <p className="mono text-foreground/80 text-lg tracking-wide">
                        ****************
                    </p>

                    <CopyButton
                        successMessage="Token copied to clipboard"
                        contentToCopy={credentials.persistentToken}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
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
}

function DownloadTimesheetButton({
    credentials,
}: {
    credentials: PlatformCredentialsFullRead;
}) {
    const reportName = credentials.employee?.fullName ?? credentials.name;
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
            <PopoverContent
                className="flex w-auto flex-col gap-4 p-0"
                align="start"
            >
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
                <div className="flex items-center justify-center gap-2 pb-4">
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
                                    Preview timesheet{" "}
                                    {format(range.from, "dd-MM-yyyy")}
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
                                    Download timesheet{" "}
                                    {format(range.from, "dd-MM-yyyy")}
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
}

function DeleteButton({ credentialsId }: { credentialsId: number }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const deleteCredentials = () => {
        startTransition(async () => {
            const res = await deleteAction(credentialsId);
            if (isFailure(res)) {
                notifyError(
                    "Error during credentials deletion, check server logs",
                );
                return;
            }

            notifySuccess("Credentials deleted");
            router.refresh();
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex bg-destructive text-destructive-foreground uppercase">
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
                        This action cannot be undone. This will permanently
                        delete these credentials.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Nope, undo please
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={isPending}
                        onClick={() => deleteCredentials()}
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SyncTimesheetButton({ credentialsId }: { credentialsId: number }) {
    const [isPending, startTransition] = useTransition();
    const syncButtonToggle = useRef<HTMLButtonElement>(null);

    const syncData = () => {
        const { from, to } = range ?? {};
        if (!(from && to)) {
            return;
        }
        notifySuccess("Data sync will continue in background");
        startTransition(async () => {
            await syncTimeSpentForClient(credentialsId, { from, to });
        });
        syncButtonToggle.current?.click();
    };

    const today = new Date();
    const firstDateRange = startOfMonth(today);
    const lastDateRange = endOfMonth(today);
    const initialRange = { from: firstDateRange, to: lastDateRange };
    const [range, setRange] = useState<DateRange | undefined>(initialRange);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button ref={syncButtonToggle}>
                    <FaSync /> Sync timesheet
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="flex w-auto flex-col gap-4 p-0"
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
                <div className="flex items-center justify-center pb-4">
                    <Button disabled={isPending} onClick={syncData}>
                        Sync {format(range?.from ?? today, "dd-MM-yyyy")}
                        <FaArrowRight />
                        {format(range?.to ?? today, "dd-MM-yyyy")}{" "}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
