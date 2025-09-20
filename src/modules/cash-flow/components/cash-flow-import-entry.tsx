"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { handledDeleteCashFlowImport } from "../cash-flow.actions";
import { isFailure } from "@/utils/server-action-utils";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { Trash2 } from "lucide-react";

export function CashFlowImportEntry({
  entry,
  onDeleted,
}: {
  entry: any;
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
    <div className="border border-gray-300 rounded-lg p-4 mb-4 flex flex-col gap-2 relative">
      <button
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-100 text-red-600 disabled:opacity-50"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete import"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <div className="text-sm text-gray-600">
        {entry.importedAt ? (
          <>Imported at: {new Date(entry.importedAt).toLocaleString()}</>
        ) : (
          <>Not imported yet</>
        )}
      </div>
      <div className="flex gap-2 items-center justify-between">
        {entry.fileName && (
          <div className="text-sm text-gray-600">
            File Name: {entry.fileName}
          </div>
        )}
        <div className="text-sm font-bold text-gray-600">
          File Size: {entry.fileSizeInKB} KB
        </div>
      </div>

      {isPending && <div className="text-xs text-red-600">Deleting...</div>}
    </div>
  );
}
