"use client";
import { KPlatformCredentialsRead } from "@/drizzle/drizzle-types";
import { Badge } from "@/components/ui/badge";
import { SiJirasoftware, SiRedmine } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Copy, Trash } from "lucide-react";
import { FaSync } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
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
import { useTransition } from "react";
import { deleteKPlatformCredentials } from "@/modules/k-platform-credentials/actions/k-platform-credentials-delete";
import { useRouter } from "next/navigation";
import syncTimeSpentForClient from "@/modules/sync-data/actions/sync-time-spent-by-credentials-for-client";
import Link from "next/link";

export const KPlatformCredentialsCard = ({
  credentials,
}: {
  credentials: KPlatformCredentialsRead;
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteCredentials = () => {
    startTransition(async () => {
      await deleteKPlatformCredentials(credentials.id);
      router.refresh();
    });
  };

  const syncData = () => {
    toast({
      description: "Data sync will continue in background",
      title: "K1",
    });
    startTransition(async () => {
      await syncTimeSpentForClient(credentials.id);
    });
  };

  // TODO, we should just use location.origin, but Bless service cannot reach us in localhost...
  const url = `https://kuama-control-center.vercel.app/reports/easyredmine/${credentials.id}`;
  const fileName = `${credentials.name.toLowerCase().replaceAll(" ", "-")}-report.pdf`; // TODO we should use the name of the user from easyredmine

  return (
    <div className="rounded-lg shadow p-8 flex flex-col items-start gap-4 bg-background overflow-hidden group">
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
            toast({ description: "Endpoint copied to clipboard", title: "K1" });
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
            toast({ description: "Token copied to clipboard", title: "K1" });
          }}
        />
      </div>

      <div className="flex justify-between items-center gap-2 mt-auto w-full">
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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

        <Button disabled={isPending} onClick={syncData}>
          <FaSync /> Sync data
        </Button>

        <Link href={`/api/pdf?url=${url}&fileName=${fileName}`} target="_blank">
          <Button>See report</Button>
        </Link>
      </div>
    </div>
  );
};
