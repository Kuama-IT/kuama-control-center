import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/modules/auth/auth";
import { suppliersServer } from "@/modules/suppliers/suppliers.server";

const paramSchema = z.object({ id: z.string() });

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(
            { error: "improper data provided" },
            { status: 400 },
        );
    }

    try {
        const awaited = await params;

        const parsedRequest = paramSchema.parse(awaited);
        const supplierId = parseInt(parsedRequest.id);
        if (Number.isNaN(supplierId)) {
            return NextResponse.json(
                { error: "improper data provided" },
                { status: 400 },
            );
        }

        let date: Date | undefined;
        const rawYear = req.nextUrl.searchParams.get("year");
        if (rawYear) {
            const parsedYear = Number(rawYear);
            date = new Date();
            date.setFullYear(parsedYear);
        }

        const result = await suppliersServer.getTotalInvoiced({
            id: supplierId,
            year: date,
        });

        return NextResponse.json(result);
    } catch (_err) {
        return NextResponse.json(
            { error: "failed to load data" },
            { status: 500 },
        );
    }
}
