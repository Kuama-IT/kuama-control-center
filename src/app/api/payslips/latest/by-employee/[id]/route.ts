import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { payslipsServer } from "@/modules/payslips/payslips.server";

const paramSchema = z.object({ id: z.string() });
// TODO: ensure auth
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const parsedRequest = paramSchema.parse(await params);
    const employeeId = parseInt(parsedRequest.id);
    if (isNaN(employeeId)) {
      NextResponse.json({ error: "improper data provided" }, { status: 400 });
      return;
    }
    const result = await payslipsServer.getLatestByEmployeeId(employeeId);
    return NextResponse.json(result);
  } catch (err) {
    NextResponse.json({ error: "failed to load data" }, { status: 500 });
  }
}
