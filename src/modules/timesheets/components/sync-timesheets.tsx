"use client";
import { endOfMonth, format, startOfMonth } from "date-fns";
import Link from "next/link";
import {
    type FormEvent,
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import { type DateRange } from "react-day-picker";
import { FaArrowRight, FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getUnlimitedAccessToken } from "@/modules/access-tokens/access-tokens.actions";
import {
    useSyncAbsenceReasonsAndClosuresFromDipendentiInCloudMutation,
    useSyncPresenceAndAbsenceFromDipendentiInCloudActionMutation,
} from "@/modules/timesheets/mutations/timesheets.mutations";
import { BrutalButton, BrutalSeparator } from "@/modules/ui";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { Title } from "@/modules/ui/components/title";
import { useDateRange } from "@/modules/ui/hooks/useDateRange";
import { isFailure } from "@/utils/server-action-utils";

export default function SyncTimesheets() {
    return (
        <>
            <Title>Timesheets</Title>

            <div className="flex flex-col items-center gap-8">
                <SyncTimesheetForm />
                <BrutalSeparator />

                <SyncAbsenceReasonsAndClosures />
                <BrutalSeparator />
                <PreviewEmployeePresenceReport />
            </div>
        </>
    );
}

const PreviewEmployeePresenceReport = () => {
    const syncButtonToggle = useRef<HTMLButtonElement>(null);

    const [accessToken, setAccessToken] = useState<string | undefined>(
        undefined,
    );
    const [origin, setOrigin] = useState<string | undefined>(undefined);

    const { to, setRange, range, from, today } = useDateRange();
    const url = `${origin}/reports/dipendenti-in-cloud?from=${from}&to=${to}&accessToken=${accessToken}`;

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setOrigin(location?.origin);
        startTransition(async () => {
            const accessTokenRecord = await getUnlimitedAccessToken();
            if (!isFailure(accessTokenRecord)) {
                setAccessToken(accessTokenRecord.token);
            }
        });
    }, []);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <BrutalButton ref={syncButtonToggle}>
                    {isPending
                        ? "Previewing presence report"
                        : "Preview presence report"}
                </BrutalButton>
            </PopoverTrigger>
            <PopoverContent
                className="flex w-auto flex-col gap-4 p-0"
                align="start"
            >
                <Calendar
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
                <div className="flex items-center justify-center p-4">
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
                                Preview presence report{" "}
                                {format(range.from, "dd-MM-yyyy")}
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

const SyncAbsenceReasonsAndClosures = () => {
    const mutation =
        useSyncAbsenceReasonsAndClosuresFromDipendentiInCloudMutation();

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        mutation.mutate(undefined, {
            onSuccess: (res) => {
                if (isFailure(res)) {
                    notifyError(
                        "Error while syncing dipendenti in cloud general info",
                    );
                    return;
                }

                notifySuccess(res.message);
            },
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <BrutalButton disabled={mutation.isPending} size="lg">
                {mutation.isPending
                    ? "Syncing closures and absence reasons"
                    : "Sync closures and absence reasons"}
            </BrutalButton>
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
    const mutation =
        useSyncPresenceAndAbsenceFromDipendentiInCloudActionMutation();

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!(range && range.from && range.to)) {
            return;
        }

        mutation.mutate(
            {
                to: range.to,
                from: range.from,
            },
            {
                onSuccess: (res) => {
                    if (isFailure(res)) {
                        notifyError(
                            "Error while syncing dipendenti in cloud timesheet",
                        );
                        return;
                    }

                    notifySuccess("Dipendenti in cloud timesheet synced");
                },
            },
        );
    };
    return (
        <form className="flex flex-col items-center gap-2" onSubmit={onSubmit}>
            <Calendar
                today={today}
                mode="range"
                onSelect={setRange}
                selected={range}
                numberOfMonths={2}
            />

            <div className="flex flex-col gap-2">
                <BrutalButton
                    size="lg"
                    disabled={
                        mutation.isPending ||
                        range?.from === undefined ||
                        range?.to === undefined
                    }
                >
                    {mutation.isPending
                        ? "Syncing employee presence information"
                        : "Sync employee presence information"}
                </BrutalButton>

                {range && range?.from && range?.to && (
                    <p className="flex items-center justify-center gap-2 text-sm italic">
                        {format(range.from, "dd-MM-yyyy")}
                        <FaArrowRight />
                        {format(range.to, "dd-MM-yyyy")}
                    </p>
                )}
            </div>
        </form>
    );
};
