"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import syncFattureInCloudInvoicesAction from "@/modules/sync-data/actions/sync-fatture-in-cloud-invoices-action";
import { useToast } from "@/hooks/use-toast";
import { isFailure } from "@/utils/server-action-utils";

export const SyncInvoices = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <Button
      disabled={isPending}
      size="lg"
      onClick={() =>
        startTransition(async () => {
          const res = await syncFattureInCloudInvoicesAction();
          if (isFailure(res)) {
            toast({
              title: "Error while syncing invoices",
            });
            return;
          }
          toast({
            title: "Invoices synced",
          });
          router.refresh();
        })
      }
    >
      Sync invoices
    </Button>
  );
};
