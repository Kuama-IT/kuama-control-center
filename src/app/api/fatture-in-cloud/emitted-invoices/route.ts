import { type NextRequest, NextResponse } from "next/server";
import { fattureInCloudApiClient } from "@/modules/fatture-in-cloud/fatture-in-cloud-api";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (!(dateFrom || dateTo)) {
        return NextResponse.json(
            { error: "date_from and date_to are required" },
            { status: 400 },
        );
    }

    const invoices = await fattureInCloudApiClient.getIssuedInvoices({
        date_from: new Date(dateFrom),
        date_to: new Date(dateTo),
    });

    return NextResponse.json(invoices);
}
