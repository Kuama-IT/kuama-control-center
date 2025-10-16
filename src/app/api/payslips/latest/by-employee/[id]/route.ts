import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { payslipsServer } from "@/modules/payslips/payslips.server";

const paramSchema = z.object({ id: z.string() });
// TODO: ensure auth
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const parsedRequest = paramSchema.parse(await params);
        const employeeId = parseInt(parsedRequest.id);
        if (Number.isNaN(employeeId)) {
            NextResponse.json(
                { error: "improper data provided" },
                { status: 400 },
            );
            return;
        }
        const result = await payslipsServer.getLatestByEmployeeId(employeeId);
        return NextResponse.json(result);
    } catch (_err) {
        NextResponse.json({ error: "failed to load data" }, { status: 500 });
    }
}
