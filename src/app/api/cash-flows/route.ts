import { cashFlowService } from "@/modules/cash-flow/cash-flow.service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dateFromParam = searchParams.get("dateFrom");
        const dateToParam = searchParams.get("dateTo");

        // Validate required parameters
        if (!dateFromParam || !dateToParam) {
            return Response.json(
                {
                    error: "Both dateFrom and dateTo parameters are required",
                    message:
                        "Please provide dateFrom and dateTo in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)",
                },
                { status: 400 },
            );
        }

        // Parse and validate dates
        const dateFrom = new Date(dateFromParam);
        const dateTo = new Date(dateToParam);

        if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
            return Response.json(
                {
                    error: "Invalid date format",
                    message:
                        "Please provide dates in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)",
                },
                { status: 400 },
            );
        }

        // Validate date range
        if (dateFrom > dateTo) {
            return Response.json(
                {
                    error: "Invalid date range",
                    message: "dateFrom must be earlier than or equal to dateTo",
                },
                { status: 400 },
            );
        }

        // Fetch cash flow entries for the date range
        const cashFlowEntries =
            await cashFlowService.getCashFlowEntriesByDateRange(
                dateFrom,
                dateTo,
            );

        return Response.json(
            {
                data: cashFlowEntries,
                count: cashFlowEntries.length,
                dateRange: {
                    from: dateFrom.toISOString(),
                    to: dateTo.toISOString(),
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching cash flow entries:", error);
        return Response.json(
            {
                error: "Internal server error",
                message: "Failed to fetch cash flow entries",
            },
            { status: 500 },
        );
    }
}
