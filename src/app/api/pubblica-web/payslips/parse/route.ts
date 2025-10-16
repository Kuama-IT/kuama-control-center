import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";

export const runtime = "nodejs";

export async function GET() {
    try {
        await pubblicaWebServer.parseAndStoreAllUnimportedPayslipsSourceFiles();
    } catch (error) {
        console.error(
            "Error parsing and storing payslips source files:",
            error,
        );
        return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
}
