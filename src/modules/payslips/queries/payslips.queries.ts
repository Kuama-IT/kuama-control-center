"use client";

import { useQuery } from "@tanstack/react-query";
import { type PayslipRead } from "@/modules/payslips/schemas/payslip-read";

export const useGetLatestPayslipByEmployeeQuery = (employeeId: number) =>
    useQuery({
        queryKey: ["payslips", "latest", "by-employee", employeeId],
        queryFn: async () => {
            const res = await fetch(
                `/api/payslips/latest/by-employee/${employeeId}`,
            );
            const json = await res.json();
            return json as PayslipRead;
        },
    });
