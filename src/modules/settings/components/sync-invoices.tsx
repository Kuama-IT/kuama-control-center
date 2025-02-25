"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import syncFattureInCloudInvoicesAction from "@/modules/sync-data/actions/sync-fatture-in-cloud-invoices-action";
import { isFailure } from "@/utils/server-action-utils";
import { cn } from "@/lib/utils";
import { FaSync } from "react-icons/fa";
import { toast } from "sonner";

export const SyncInvoices = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      size="lg"
      onClick={() =>
        startTransition(async () => {
          const res = await syncFattureInCloudInvoicesAction();
          if (isFailure(res)) {
            toast("k1", {
              description: "Error while syncing invoices",
              className: "bg-error text-foreground",
            });
            return;
          }
          toast("K1", {
            description: "Invoices synced",
          });
          router.refresh();
        })
      }
    >
      <FaSync className={cn({ "animate-spin": isPending })} />
      Sync invoices
    </Button>
  );
};
