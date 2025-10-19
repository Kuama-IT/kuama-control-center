import { useQuery } from "@tanstack/react-query";
import { type CashFlowEntryRead } from "../schemas/cash-flow-entry-read";

export const useCashFlowsQuery = ({ from, to }: { from: Date; to: Date }) => {
    return useQuery({
        queryKey: ["cashFlows", from.toISOString(), to.toISOString()],
        queryFn: async (): Promise<CashFlowEntryRead[]> => {
            const searchParams = new URLSearchParams({
                dateFrom: from.toISOString(),
                dateTo: to.toISOString(),
            });

            const response = await fetch(
                `/api/cash-flows?${searchParams.toString()}`,
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP ${response.status}: ${response.statusText}`,
                );
            }

            const data = await response.json();

            // Transform date strings back to Date objects
            return {
                ...data,
                data: data.data.map((entry) => ({
                    ...entry,
                    date: new Date(entry.date),
                })),
            };
        },
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
};

// Helper hook for common date ranges
export const useCashFlowsForCurrentMonth = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
    );

    return useCashFlowsQuery({ from, to });
};

export const useCashFlowsForCurrentYear = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), 0, 1);
    const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    return useCashFlowsQuery({ from, to });
};

export const useCashFlowsForLastNDays = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    return useCashFlowsQuery({ from, to });
};
