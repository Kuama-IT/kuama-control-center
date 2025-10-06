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

export type PdfTextItem = {
  page: number; // 1-based page index
  str: string; // text content
  x: number; // absolute x in page coordinates (after viewport transform)
  y: number; // absolute y in page coordinates (after viewport transform)
  width: number;
  height: number;
};

// Dynamically import PDF.js so TypeScript doesn't require types at build-time.
async function loadPdfjs() {
  const tryPaths = [
    "pdfjs-dist/legacy/build/pdf.mjs",
    "pdfjs-dist/build/pdf.mjs",
    "pdfjs-dist",
  ];
  for (const p of tryPaths) {
    try {
      const mod: any = await import(p as any);
      return mod;
    } catch (e) {
      // try next
    }
  }
  throw new Error(
    "pdfjs-dist module not found. Please add it to dependencies."
  );
}

export async function extractTextItems(
  pdfBuffer: ArrayBufferLike
): Promise<{ items: PdfTextItem[]; numPages: number }> {
  // if (typeof window !== "undefined") {
  //   throw new Error("pdf-layout is server-only. Do not call from the client.");
  // }
  const pdfjs = await loadPdfjs();
  const data =
    pdfBuffer instanceof ArrayBuffer
      ? new Uint8Array(pdfBuffer)
      : new Uint8Array(pdfBuffer as ArrayBufferLike);

  const loadingTask = pdfjs.getDocument({
    data,
    isEvalSupported: false,
    disableFontFace: true,
    disableWorker: true, // ensure no worker thread in Next.js server runtime
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
      const m = pdfjs.Util.transform(viewport.transform, item.transform);
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
