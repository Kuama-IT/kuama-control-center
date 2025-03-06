"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Title } from "@/modules/ui/components/title";
import { KEmployeeById } from "@/modules/k-employees/actions/k-employee-by-id-action";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { isFailure } from "@/utils/server-action-utils";
import deleteKEmployee from "@/modules/k-employees/actions/k-employee-delete-action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FaSync } from "react-icons/fa";

export const KEmployeeDangerZone = ({
  employee,
}: {
  employee: KEmployeeById;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDeleteConfirmation = () => {
    startTransition(async () => {
      const res = await deleteKEmployee(employee.id);
      if (isFailure(res)) {
        toast("Error during employee deletion, check server logs", {
          className: "bg-error text-foreground",
        });
        return;
      }
      router.push("/k-employees");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Title className="uppercase">Danger zone</Title>
      <div className="rounded border border-destructive p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold">Delete this employee</p>
            <p>
              Once you delete an employee, there is no going back. Please be
              certain.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                Delete this employee
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {employee.fullName}</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  employee from Kuama Control center.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={onDeleteConfirmation}
                >
                  {isPending && <FaSync className="animate-spin" />}I want to
                  delete this employee
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
