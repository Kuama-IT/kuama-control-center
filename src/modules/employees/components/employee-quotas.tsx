"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLatestPayslipByEmployeeQuery } from "@/modules/payslips/queries/payslips.queries";
import { cn } from "@/lib/utils";
import { brutalTheme } from "@/modules/ui/brutal-theme";
import React from "react";

export const EmployeeQuotas = ({ employee }: { employee: { id: number } }) => {
    const query = useGetLatestPayslipByEmployeeQuery(employee.id);

    if (query.isLoading) {
        return (
            <div
                className={cn("grid gap-2", brutalTheme.colors.primary.accent)}
            >
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
            </div>
        );
    }

    if (query.isError || !query.data) {
        return (
            <div
                className={cn(
                    "font-mono text-center text-sm",
                    brutalTheme.borders.thin,
                    brutalTheme.colors.primary.accent,
                    brutalTheme.shadows.sm,
                )}
            >
                Nessun dato disponibile
            </div>
        );
    }

    const {
        workedDays,
        workedHours,
        permissionsHoursBalance,
        holidaysHoursBalance,
        rolHoursBalance,
    } = query.data;

    return (
        <div
            className={cn(
                "grid gap-2 font-mono text-sm",
                brutalTheme.colors.primary.accent,
            )}
        >
            <div>
                <span className="font-bold">Lavorato:</span> {workedDays} giorni
                / {workedHours} ore
            </div>
            <div>
                <span className="font-bold">Saldo permessi (h):</span>{" "}
                {permissionsHoursBalance}
            </div>
            <div>
                <span className="font-bold">Saldo ferie (h):</span>{" "}
                {holidaysHoursBalance}
            </div>
            <div>
                <span className="font-bold">Saldo ROL (h):</span>{" "}
                {rolHoursBalance}
            </div>
        </div>
    );
};
