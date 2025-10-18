"use client";

import { format } from "date-fns";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Text,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type EmployeeReadExtended } from "@/modules/employees/schemas/employee-read-extended";
import { BrutalSeparator, brutalTheme } from "@/modules/ui";
import { BrutalButton } from "@/modules/ui/components/brutal-button";
import { BrutalCard } from "@/modules/ui/components/brutal-layout";
import { Title } from "@/modules/ui/components/title";

type SortField =
    | "age"
    | "averageNet"
    | "lastPayroll"
    | "averageCost"
    | "permissionsHoursBalance"
    | "holidaysHoursBalance"
    | "rolHoursBalance"
    | null;

type SortDirection = "asc" | "desc";

export const EmployeesWithPayslips = ({
    employees,
}: {
    employees: EmployeeReadExtended[];
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
        } else if (sortField === "averageNet") {
            aValue = a.averageNet;
            bValue = b.averageNet;
        } else if (sortField === "averageCost") {
            aValue = a.averageCost;
            bValue = b.averageCost;
        } else if (sortField === "lastPayroll") {
            aValue = a.payslips.length > 0 ? a.payslips[0].net : -1; // Treat no payrolls as -1
            bValue = b.payslips.length > 0 ? b.payslips[0].net : -1;
        } else if (sortField === "permissionsHoursBalance") {
            aValue =
                a.payslips.length > 0
                    ? a.payslips[0].permissionsHoursBalance
                    : -1;
            bValue =
                b.payslips.length > 0
                    ? b.payslips[0].permissionsHoursBalance
                    : -1;
        } else if (sortField === "holidaysHoursBalance") {
            aValue =
                a.payslips.length > 0 ? a.payslips[0].holidaysHoursBalance : -1;
            bValue =
                b.payslips.length > 0 ? b.payslips[0].holidaysHoursBalance : -1;
        } else if (sortField === "rolHoursBalance") {
            aValue = a.payslips.length > 0 ? a.payslips[0].rolHoursBalance : -1;
            bValue = b.payslips.length > 0 ? b.payslips[0].rolHoursBalance : -1;
        } else {
            return 0;
        }

        if (sortDirection === "asc") {
            return aValue - bValue;
        }
        return bValue - aValue;
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

    // Prepare chart data: compare Average Net vs Average Cost per employee
    const chartData = employees.map((e) => ({
        name: [e.name, e.surname].filter(Boolean).join(" ") || "N/A",
        averageNet: Number(e.averageNet ?? 0),
        averageCost: Number(e.averageCost ?? 0),
    }));

    // Show top 12 by averageNet to keep the chart readable; fallback to all if <= 12
    const chartDataTop = chartData
        .slice()
        .sort((a, b) => b.averageNet - a.averageNet)
        .slice(0, 6);

    const euroFormatter = (value: number) =>
        new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <BrutalCard className="space-y-4 p-8">
            <div className="flex items-center justify-between">
                <Title>Employees with Payrolls</Title>
                <Link
                    href="/employees"
                    className={brutalTheme.typography.caption}
                >
                    Back to Employees
                </Link>
            </div>

            <BrutalSeparator />
            {/* Comparative Chart */}
            {employees.length > 0 ? (
                <div className="w-full overflow-x-auto border-4 border-black bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className={brutalTheme.typography.subheading}>
                            Average Net vs Average Cost
                        </h3>
                        <span className={brutalTheme.typography.caption}>
                            Showing top {chartDataTop.length} by Average Net
                        </span>
                    </div>
                    <div style={{ width: "100%", height: 480, minWidth: 640 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartDataTop}
                                layout="vertical"
                                margin={{
                                    top: 8,
                                    right: 16,
                                    bottom: 8,
                                    left: 80,
                                }}
                            >
                                <CartesianGrid
                                    stroke="#000"
                                    strokeDasharray="3 3"
                                />
                                <XAxis
                                    type="number"
                                    tickFormatter={euroFormatter}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={140}
                                    tick={
                                        <YAxisTick
                                            x={0}
                                            y={0}
                                            payload={undefined}
                                        />
                                    }
                                    scale="band"
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        euroFormatter(value)
                                    }
                                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                />
                                <Legend wrapperStyle={{ fontWeight: 800 }} />
                                <Bar
                                    name="Average Net"
                                    dataKey="averageNet"
                                    fill="#22c55e"
                                    stroke="#000"
                                    strokeWidth={2}
                                />
                                <Bar
                                    name="Average Cost"
                                    dataKey="averageCost"
                                    fill="#60a5fa"
                                    stroke="#000"
                                    strokeWidth={2}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center text-muted-foreground">
                    No data to chart.
                </div>
            )}

            <BrutalSeparator />
            <Table className="w-full rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000000]">
                <TableHeader className="border-black border-b-4 bg-gray-100">
                    <TableRow className="border-black border-b-4">
                        <TableHead className="border-black border-r-4 text-right font-black uppercase tracking-wide">
                            Number
                        </TableHead>

                        <TableHead className="border-black border-r-4 font-black uppercase tracking-wide">
                            Full Name
                        </TableHead>

                        <SortableTableHead
                            onClick={() => handleSort("age")}
                            sortIcon={getSortIcon("age")}
                            label="Age"
                        />

                        <TableHead className="border-black border-r-4 font-black uppercase tracking-wide">
                            Hired On
                        </TableHead>

                        <SortableTableHead
                            onClick={() => handleSort("lastPayroll")}
                            sortIcon={getSortIcon("lastPayroll")}
                            label="Last Payslip"
                        />

                        <SortableTableHead
                            onClick={() => handleSort("averageNet")}
                            sortIcon={getSortIcon("averageNet")}
                            label="Avg Payslip"
                        />

                        <TableHead className="border-black border-r-4 text-right font-black uppercase tracking-wide">
                            Average Cost
                        </TableHead>

                        <SortableTableHead
                            onClick={() =>
                                handleSort("permissionsHoursBalance")
                            }
                            sortIcon={getSortIcon("permissionsHoursBalance")}
                            label="Perm (h)"
                        />

                        <SortableTableHead
                            onClick={() => handleSort("holidaysHoursBalance")}
                            sortIcon={getSortIcon("holidaysHoursBalance")}
                            label="Holidays (h)"
                        />

                        <SortableTableHead
                            onClick={() => handleSort("rolHoursBalance")}
                            sortIcon={getSortIcon("rolHoursBalance")}
                            label="ROL (h)"
                        />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedEmployees.map((employee) => {
                        const fullName =
                            [employee.name, employee.surname]
                                .filter(Boolean)
                                .join(" ") || "N/A";

                        return (
                            <TableRow
                                key={employee.id}
                                className="border-black border-b-4"
                            >
                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    {employee.payslips.length > 0
                                        ? employee.payslips[0]
                                              .payrollRegistrationNumber
                                        : "N/A"}
                                </TableCell>

                                <TableCell className="border-black border-r-4 font-bold">
                                    {fullName}
                                </TableCell>
                                <TableCell className="border-black border-r-4">
                                    {employee.age !== null
                                        ? `${employee.age} years`
                                        : "N/A"}
                                </TableCell>
                                <TableCell className="border-black border-r-4">
                                    {employee.hiredOn
                                        ? format(
                                              new Date(employee.hiredOn),
                                              "dd/MM/yyyy",
                                          )
                                        : "N/A"}{" "}
                                    (
                                    {employee.yearsWithCompany !== null
                                        ? `${employee.yearsWithCompany} years`
                                        : "N/A"}
                                    )
                                </TableCell>

                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    {employee.payslips.length > 0
                                        ? `€${employee.payslips[0].net.toFixed(2)}`
                                        : "N/A"}
                                </TableCell>
                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    €{employee.averageNet.toFixed(2)}
                                </TableCell>
                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    €{employee.averageCost.toFixed(2)}
                                </TableCell>
                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    {employee.payslips.length > 0
                                        ? employee.payslips[0]
                                              .permissionsHoursBalance
                                        : "N/A"}
                                </TableCell>
                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    {employee.payslips.length > 0
                                        ? employee.payslips[0]
                                              .holidaysHoursBalance
                                        : "N/A"}
                                </TableCell>
                                <TableCell className="border-black border-r-4 text-right font-mono">
                                    {employee.payslips.length > 0
                                        ? employee.payslips[0].rolHoursBalance
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {employees.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                    No employees found.
                </div>
            )}
        </BrutalCard>
    );
};

// Custom Y-Axis tick to ensure perfect vertical centering
const YAxisTick = ({
    x,
    y,
    payload,
}: {
    x: number;
    y: number;
    payload?: { value: string | number };
}) => (
    <Text
        x={x}
        y={y}
        verticalAnchor="middle"
        textAnchor="end"
        style={{ fontWeight: 700 }}
    >
        {payload?.value}
    </Text>
);

const SortableTableHead = ({
    onClick,
    sortIcon,
    label,
}: {
    onClick: () => void;
    sortIcon: ReactNode;
    label: ReactNode;
}) => {
    return (
        <TableHead className="border-black border-r-4 text-right font-black uppercase tracking-wide">
            <BrutalButton
                variant="ghost"
                onClick={onClick}
                className="flex h-auto items-center p-0 font-black uppercase tracking-wide"
                style={{ fontWeight: 900, fontSize: "inherit" }}
            >
                {label}
                {sortIcon}
            </BrutalButton>
        </TableHead>
    );
};
