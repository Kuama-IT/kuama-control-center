import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";

// Ensure this route executes in the Node.js runtime so server-only libs like pdfjs-dist
// can be dynamically imported from node_modules at runtime.
export const runtime = "nodejs";

export async function GET() {
try {
    await pubblicaWebServer.parseAndStoreAllUnimportedPayslipsSourceFiles();
  } catch (error) {
    console.error("Error parsing and storing payslips source files:", error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });

}