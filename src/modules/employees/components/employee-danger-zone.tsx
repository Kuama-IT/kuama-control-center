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
import { deleteAction as deleteEmployee, type EmployeeByIdActionResult } from "@/modules/employees/employees.actions";
import { useRouter } from "next/navigation";
import { FaSync } from "react-icons/fa";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { useServerActionMutation } from "@/modules/ui/hooks/useServerActionMutation";

export const EmployeeDangerZone = ({ employee }: { employee: EmployeeByIdActionResult }) => {
	const { mutateAsync, isPending } = useServerActionMutation(deleteEmployee);
	const router = useRouter();

	const onDeleteConfirmation = () => {
		(async () => {
			try {
				await mutateAsync(employee.id);
				notifySuccess(`${employee.fullName} has been deleted`);
				router.push("/employees");
			} catch (e) {
				notifyError("Error during employee deletion, check server logs");
			}
		})();
	};

	return (
		<div className="flex flex-col gap-4">
			<Title className="uppercase">Danger zone</Title>
			<div className="rounded border border-destructive p-4">
				<div className="flex justify-between items-center">
					<div>
						<p className="font-bold">Delete this employee</p>
						<p>Once you delete an employee, there is no going back. Please be certain.</p>
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
									This action cannot be undone. This will permanently delete the employee from Kuama Control center.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction disabled={isPending} onClick={onDeleteConfirmation}>
									{isPending && <FaSync className="animate-spin" />}I want to delete this employee
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	);
};
