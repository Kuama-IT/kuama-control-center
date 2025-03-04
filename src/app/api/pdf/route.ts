import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import { serverEnv } from "@/env/server-env";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const fileName = searchParams.get("fileName");

  if (!url) {
    return Response.json(
      { message: `A ?url query-parameter is required` },
      { status: 400 },
    );
  }

  if (!fileName) {
    return Response.json(
      { message: `A ?fileName query-parameter is required` },
      { status: 400 },
    );
  }

  // todo add a one time token to the url to be checked by the report page

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${serverEnv.blessToken}`,
  });

  const page = await browser.newPage();
  await page.goto(url);

  const pdfBuffer = await page.pdf({
    format: "A4",
    displayHeaderFooter: true,
    margin: { top: 20, bottom: 20 },
    headerTemplate: "",
    footerTemplate: `
      <div style="font-size: 10px; width: 100%; text-align: right; padding-right: 10mm;">
        Pagina <span class="pageNumber"></span> di <span class="totalPages"></span>
      </div>
    `,
  });

  await browser.close();
  return new Response(pdfBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "application/pdf",
    },
    status: 200,
  });
}
