import { pubblicaWebServer } from "@/modules/pubblica-web/pubblica-web.server";
export const runtime = "nodejs";

// TODO: add a token guard and make this a POST endpoint
export async function GET() {
  try {
    await pubblicaWebServer.storePayslipsSourceFileSince2021();
  } catch (error) {
    console.error("Error storing payslips source file:", error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
