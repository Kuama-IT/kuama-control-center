import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";

// TODO: add a token guard and make this a POST endpoint
export async function GET() {
    try {
        await pubblicaWebServer.storeCurrentMonthMonthlyBalance();
    } catch (error) {
        console.error("Error storing current month monthly balance:", error);
        return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
}
