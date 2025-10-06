/*
  PDF.js-based text layout helper for robust payroll parsing without OCR.

  Why dynamic import?
  - Avoid adding a hard dependency on pdfjs-dist at build time. This file compiles even if pdfjs isn't installed.
  - At runtime, when you actually call extractTextItems, it will import pdfjs-dist.

  Usage example (inside pubblica-web.utils.ts):
    import { extractTextItems, groupIntoRows, clusterColumns, mapHeadersToColumns } from "@/modules/pdf/pdf-layout";

    const items = await extractTextItems(buffer);
    const rows = groupIntoRows(items);
    const columns = clusterColumns(rows);
    const headerMap = mapHeadersToColumns(rows, ["LORDO", "NETTO"]);
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

export type PdfTextRow = {
  page: number;
  y: number; // representative y for the row (average)
  items: PdfTextItem[]; // items sorted by x asc
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
    "pdfjs-dist module not found. Please add it to dependencies.",
  );
}

export async function extractTextItems(
  pdfBuffer: ArrayBufferLike,
): Promise<PdfTextItem[]> {
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

  return items;
}

// Group text items into rows by y proximity. Works per page to avoid cross-page grouping.
export function groupIntoRows(
  items: PdfTextItem[],
  yTolerance = 1.5,
): PdfTextRow[] {
  const rows: PdfTextRow[] = [];
  const byPage = new Map<number, PdfTextItem[]>();
  for (const it of items) {
    const arr = byPage.get(it.page) ?? [];
    arr.push(it);
    byPage.set(it.page, arr);
  }

  for (const [page, pageItems] of byPage.entries()) {
    // Sort by y descending (top to bottom in PDF often increases/decreases depending on transform; viewport took care of it)
    pageItems.sort((a, b) => b.y - a.y || a.x - b.x);
    let current: PdfTextItem[] = [];
    let currentY: number | null = null;

    for (const it of pageItems) {
      if (currentY === null) {
        current = [it];
        currentY = it.y;
        continue;
      }
      if (Math.abs(it.y - currentY) <= yTolerance) {
        current.push(it);
      } else {
        rows.push({
          page,
          y: avgY(current),
          items: current.sort((a, b) => a.x - b.x),
        });
        current = [it];
        currentY = it.y;
      }
    }
    if (current.length) {
      rows.push({
        page,
        y: avgY(current),
        items: current.sort((a, b) => a.x - b.x),
      });
    }
  }

  // Stable sort by page then descending y (visual top-down)
  rows.sort((a, b) => a.page - b.page || b.y - a.y);
  return rows;
}

function avgY(items: PdfTextItem[]) {
  return items.reduce((s, i) => s + i.y, 0) / items.length;
}

export type ColumnCenters = number[]; // x centers sorted asc

// Cluster columns using x positions from numeric-looking items first, then all items.
export function clusterColumns(
  rows: PdfTextRow[],
  xTolerance = 6,
): ColumnCenters {
  const xs: number[] = [];
  const amountRegex = /\d{1,3}(?:\.\d{3})*,\d{2}/; // Italian amount

  // Prefer numeric columns (amounts)
  for (const row of rows) {
    for (const it of row.items) {
      if (amountRegex.test(it.str)) xs.push(it.x);
    }
  }
  // Fallback to all items if not enough
  if (xs.length < 3) {
    for (const row of rows) for (const it of row.items) xs.push(it.x);
  }

  xs.sort((a, b) => a - b);
  const centers: number[] = [];
  for (const x of xs) {
    const last = centers[centers.length - 1];
    if (last === undefined || Math.abs(x - last) > xTolerance) {
      centers.push(x);
    } else {
      // merge toward average
      centers[centers.length - 1] = (last + x) / 2;
    }
  }
  return centers;
}

export type HeaderMap = Record<string, number>; // normalized header -> column index

export function mapHeadersToColumns(
  rows: PdfTextRow[],
  headerCandidates: string[],
  columns?: ColumnCenters,
  normalize = defaultNormalize,
): HeaderMap {
  const wanted = headerCandidates.map((h) => normalize(h));
  // Find a row that contains at least one candidate
  for (const row of rows) {
    const normItems = row.items.map((it) => ({ ...it, n: normalize(it.str) }));
    const hits = normItems.filter((it) => wanted.includes(it.n));
    if (!hits.length) continue;

    const centers = columns ?? clusterColumns([row]);
    const headerMap: HeaderMap = {};
    for (const h of hits) {
      const colIdx = nearestColumnIndex(h.x, centers);
      headerMap[h.n] = colIdx;
    }
    // Return first header row mapping; callers can refine if needed
    return headerMap;
  }
  return {};
}

export function nearestColumnIndex(x: number, centers: ColumnCenters) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < centers.length; i++) {
    const d = Math.abs(centers[i] - x);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function defaultNormalize(s: string) {
  return s
    .toLocaleLowerCase("it-IT")
    .replace(/\s+/g, " ")
    .replace(/[.:]/g, "")
    .trim();
}

// Find a section by a header text, returns rows after that header until the next blank-line or header-like row
export function findSection(
  rows: PdfTextRow[],
  headerText: string,
  normalize = defaultNormalize,
): PdfTextRow[] {
  const target = normalize(headerText);
  let found = false;
  const out: PdfTextRow[] = [];
  for (const row of rows) {
    const line = normalize(row.items.map((i) => i.str).join(" "));
    if (!found) {
      if (line.includes(target)) found = true;
      continue;
    }
    if (!row.items.length) break;
    // crude stop condition: next header-like line (all caps words) or a wide gap in y could be used here if needed
    out.push(row);
  }
  return out;
}
