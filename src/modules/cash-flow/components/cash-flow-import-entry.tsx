"use client";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type CashFlowImportRead } from "@/modules/cash-flow/schemas/cash-flow-import-read";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/server-action-utils";
import { handledDeleteCashFlowImport } from "../cash-flow.actions";

export function CashFlowImportEntry({
    entry,
    onDeleted,
}: {
    entry: CashFlowImportRead;
    onDeleted?: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            const res = await handledDeleteCashFlowImport(entry.id);
            if (!isFailure(res)) {
                notifySuccess("Import deleted");

                router.refresh();
                onDeleted?.();
            } else {
                notifyError(res.message);
            }
        });
    };

    return (
        <div className="relative mb-4 flex flex-col gap-2 rounded-lg border border-gray-300 p-4">
            <button
                className="absolute top-2 right-2 rounded-full p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                onClick={handleDelete}
                disabled={isPending}
                aria-label="Delete import"
            >
                <Trash2 className="h-5 w-5" />
            </button>
            <div className="text-gray-600 text-sm">
                {entry.importedAt
                    ? `Imported at: ${format(new Date(entry.importedAt), "dd/MM/yyyy")}`
                    : "Not imported yet"}
            </div>
            <div className="flex items-center justify-between gap-2">
                {entry.fileName && (
                    <div className="text-gray-600 text-sm">
                        {`File Name: ${entry.fileName}`}
                    </div>
                )}
                <div className="font-bold text-gray-600 text-sm">
                    {`File Size: ${entry.fileSizeInKB} KB`}
                </div>
                <Link
                    href={`/cash-flow/imports/${entry.id}/preview`}
                    className="text-blue-600 text-sm hover:underline"
                >
                    {"Preview import"}
                </Link>
            </div>

            {isPending && (
                <div className="text-red-600 text-xs">{"Deleting..."}</div>
            )}
        </div>
    );
}
