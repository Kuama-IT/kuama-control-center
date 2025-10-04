"use client";
import type { EmployeeWithPayrolls } from "../employees.service";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type SortField = "age" | "averagePayroll" | "lastPayroll" | null;
type SortDirection = "asc" | "desc";

export const EmployeesWithPayrolls = ({
	employees,
}: {
	employees: EmployeeWithPayrolls[];
}) => {
	const [sortField, setSortField] = useState<SortField>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedEmployees = [...employees].sort((a, b) => {
		if (!sortField) return 0;

		let aValue: number;
		let bValue: number;

		if (sortField === "age") {
			aValue = a.age ?? -1; // Treat null as -1 to sort at the beginning
			bValue = b.age ?? -1;
		} else if (sortField === "averagePayroll") {
			aValue = a.averagePayroll;
			bValue = b.averagePayroll;
		} else if (sortField === "lastPayroll") {
			aValue = a.payrolls.length > 0 ? a.payrolls[0].net : -1; // Treat no payrolls as -1
			bValue = b.payrolls.length > 0 ? b.payrolls[0].net : -1;
		} else {
			return 0;
		}

		if (sortDirection === "asc") {
			return aValue - bValue;
		} else {
			return bValue - aValue;
		}
	});

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) {
			return <ChevronsUpDown className="ml-1 h-4 w-4" />;
		}
		return sortDirection === "asc" ? (
			<ChevronUp className="ml-1 h-4 w-4" />
		) : (
			<ChevronDown className="ml-1 h-4 w-4" />
		);
	};
	return (
		<div className="space-y-4 p-8">
			<h2 className="text-2xl font-bold">Employees with Payrolls</h2>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Full Name</TableHead>
						<TableHead>
							<Button
								variant="ghost"
								onClick={() => handleSort("age")}
								className="h-auto p-0 font-medium hover:bg-transparent"
							>
								Age
								{getSortIcon("age")}
							</Button>
						</TableHead>
						<TableHead>Hired On</TableHead>
						<TableHead>Years with Company</TableHead>
						<TableHead className="text-right">
							<Button
								variant="ghost"
								onClick={() => handleSort("lastPayroll")}
								className="h-auto p-0 font-medium hover:bg-transparent ml-auto flex items-center"
							>
								Last Payroll
								{getSortIcon("lastPayroll")}
							</Button>
						</TableHead>
						<TableHead className="text-right">
							<Button
								variant="ghost"
								onClick={() => handleSort("averagePayroll")}
								className="h-auto p-0 font-medium hover:bg-transparent ml-auto flex items-center"
							>
								Average Payroll
								{getSortIcon("averagePayroll")}
							</Button>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedEmployees.map((employee) => {
						const fullName =
							[employee.name, employee.surname].filter(Boolean).join(" ") ||
							"N/A";

						return (
							<TableRow key={employee.id}>
								<TableCell className="font-medium">{fullName}</TableCell>
								<TableCell>
									{employee.age !== null ? `${employee.age} years` : "N/A"}
								</TableCell>
								<TableCell>
									{employee.hiredOn
										? format(new Date(employee.hiredOn), "dd/MM/yyyy")
										: "N/A"}
								</TableCell>
								<TableCell>
									{employee.yearsWithCompany !== null
										? `${employee.yearsWithCompany} years`
										: "N/A"}
								</TableCell>
								<TableCell className="text-right font-mono">
									{employee.payrolls.length > 0
										? `€${employee.payrolls[0].net.toFixed(2)}`
										: "N/A"}
								</TableCell>
								<TableCell className="text-right font-mono">
									€{employee.averagePayroll.toFixed(2)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{employees.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					No employees found.
				</div>
			)}
		</div>
	);
};
