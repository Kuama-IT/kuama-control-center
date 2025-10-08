/*
  PDF.js-based text layout helper for robust payroll parsing without OCR.

  Why dynamic import?
  - Avoid adding a hard dependency on pdfjs-dist at build time. This file compiles even if pdfjs isn't installed.
  - At runtime, when you actually call extractTextItems, it will import pdfjs-dist.

  Usage example (inside pubblica-web.utils.ts):
    import { extractTextItems, groupIntoRows, clusterColumns, mapHeadersToColumns } from "@/modules/pdf/pdf-layout";

    const items = await extractTextItems(buffer);
    // Then pick values by (rowIndex, headerMap["NETTO"]) rather than nearest-neighbor.
*/

import { getDocument, Util } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";

export type PdfTextItem = {
  page: number; // 1-based page index
  str: string; // text content
  x: number; // absolute x in page coordinates (after viewport transform)
  y: number; // absolute y in page coordinates (after viewport transform)
  width: number;
  height: number;
};

export async function extractTextItems(
  pdfBuffer: ArrayBufferLike
): Promise<{ items: PdfTextItem[]; numPages: number }> {
  const data =
    pdfBuffer instanceof ArrayBuffer
      ? new Uint8Array(pdfBuffer)
      : new Uint8Array(pdfBuffer as ArrayBufferLike);

  const loadingTask = getDocument({
    data,
    isEvalSupported: false,
    disableFontFace: true,
    verbosity: 0,
  });
  const doc = await loadingTask.promise;

  const items: PdfTextItem[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const content = await page.getTextContent();
    for (const item of content.items as any[]) {
      // item.transform is a 6-element matrix; combine with viewport.transform
      const m = Util.transform(viewport.transform, item.transform);
      const x = m[4];
      const y = m[5];
      const str: string = (item.str ?? "").trim();
      if (!str) continue;
      items.push({
        page: pageNum,
        str,
        x,
        y,
        width: item.width ?? 0,
        height: item.height ?? 0,
      });
    }
  }

  return { items, numPages: doc.numPages };
}
