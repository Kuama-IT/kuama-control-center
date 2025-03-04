import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import { serverEnv } from "@/env/server-env";
import { kAccessTokensServer } from "@/modules/k-access-tokens/k-access-tokens-server";
import { isFailure } from "@/utils/server-action-utils";

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

  let parsedUri;
  try {
    parsedUri = new URL(url);
  } catch (e) {
    return Response.json({ message: `Invalid url provided` }, { status: 400 });
  }

  if (!fileName) {
    return Response.json(
      { message: `A ?fileName query-parameter is required` },
      { status: 400 },
    );
  }

  const accessTokenCreateResult = await kAccessTokensServer.create({
    purpose: `PDF generation for ${url}`,
    allowedUsages: 1,
  });

  if (isFailure(accessTokenCreateResult)) {
    return Response.json(accessTokenCreateResult, { status: 500 });
  }

  const accessToken = accessTokenCreateResult.data.token;
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${serverEnv.blessToken}`,
  });

  parsedUri.searchParams.set("accessToken", accessToken);

  console.log(`Generating PDF for ${parsedUri.toString()}`);
  const page = await browser.newPage();
  await page.goto(parsedUri.toString());

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
