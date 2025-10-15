import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";

// TODO: add a token guard and make this a POST endpoint
export async function GET() {
    try {
        await pubblicaWebServer.parseAllUnparsedMonthlyBalances();
    } catch (error) {
        console.error("Error storing missing monthly balances:", error);
        return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
}
