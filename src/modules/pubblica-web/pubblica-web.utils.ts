import { Page, type Text } from "pdf2json";
import { pdfUtils } from "../pdf/pdf.utils";
import {
  extractTextItems,
  groupIntoRows,
  clusterColumns,
  mapHeadersToColumns,
  nearestColumnIndex,
  defaultNormalize,
  type PdfTextRow,
  PdfTextItem,
} from "@/modules/pdf/pdf-layout";
import { distanceBetweenPoints } from "recharts/types/util/PolarUtils";

type LabelDefinition = {
  type: "text" | "italian_date" | "italian_number" | "number";
  label: string;
  gapY: number;
  gapX: number;
  negativeGapX: number;
  targetLabel?: string;
};

export const pubblicaWebUtils = {
  tryParseFullNameFromOddContent,

  async parseSalaryMonthlyBalance(buffer: ArrayBufferLike) {
    const parsedPdf = await pdfUtils.loadPdfStructure(buffer);
    let totalBusinessCost = 0;

    for (const page of parsedPdf.Pages) {
      try {
        totalBusinessCost += await readTotalBusinessCostFromPage(page);
      } catch (e) {
        console.error("Error reading total business cost from page:", e);
        continue;
      }
    }

    return {
      totalBusinessCost,
    };
  },
  async parseSalary(buffer: ArrayBufferLike) {
    const parsedPdf = await pdfUtils.loadPdfStructure(buffer);

    const salaryPage = parsedPdf.Pages[0];
    if (!salaryPage) {
      throw new Error(`Could not find any page in the salary PDF`);
    }

    const salaryInfo = await readPayrollInfosFromfPage(salaryPage);

    // For single page, extract the entire document as PDF
    const pageAsPdf = await pdfUtils.extractPageAsPdf(buffer, 0);
    const pageAsPdfBase64 = Buffer.from(pageAsPdf).toString("base64");

    return {
      ...salaryInfo,
      pageAsPdfBase64,
    };
  },
  /**
   * Experimental: parse salary using PDF.js layout (rows/columns) instead of nearest-neighbor.
   * Keeps logic declarative and resilient when labels are not visually near values.
   */
  async parseSalaryWithPdfjsLayout(buffer: ArrayBufferLike) {
    let items;
    try {
      items = await extractTextItems(buffer);
    } catch (e) {
      // Fallback: if PDF.js is not available in the environment, use the legacy parser
      console.warn(
        "PDF.js layout parser unavailable, falling back to legacy parse:",
        e,
      );
      const classic = await pubblicaWebUtils.parseSalary(buffer);
      return classic;
    }
    const allRows = groupIntoRows(items);
    // focus on first page rows
    let rows = allRows.filter((r) => r.page === 1);

    // reverse rows order since the first row is the last inside the pdf
    rows = rows.reverse();

    const labelDefinitions: LabelDefinition[] = [
      {
        type: "text",
        label: "codice fiscale",
        gapY: 10,
        gapX: 10,
        negativeGapX: 0,
      },
      {
        type: "text",
        label: "cognome nome",
        gapY: 10,
        gapX: 10,
        negativeGapX: 2,
      },
      {
        type: "italian_date",
        label: "data di nascita",
        gapY: 10,
        gapX: 10,
        negativeGapX: 0,
      },
      {
        type: "italian_date",
        label: "data assunzione",
        gapY: 10,
        gapX: 10,
        negativeGapX: 0,
      },
      {
        type: "italian_number",
        label: "retribuzione totale",
        gapY: 20,
        gapX: 10,
        negativeGapX: 0,
      },
      {
        type: "italian_number",
        label: "ore lavorate",
        gapY: 20,
        gapX: 10,
        negativeGapX: 0,
      },
      {
        type: "italian_number",
        label: "gg. lavorati",
        gapY: 20,
        gapX: 10,
        negativeGapX: 0,
      },
      {
        type: "italian_number",
        label: "netto",
        gapY: 20,
        gapX: 10,
        negativeGapX: 0,
      },

      {
        type: "italian_number",
        label: "permessi / ex-festivita'",
        gapY: 20,
        gapX: 10,
        negativeGapX: 5,
        targetLabel: "saldo",
      },
      {
        type: "italian_number",
        label: "ferie",
        gapY: 20,
        gapX: 10,
        negativeGapX: 5,
        targetLabel: "saldo",
      },
      {
        type: "italian_number",
        label: "r.o.l.",
        gapY: 30,
        gapX: 10,
        negativeGapX: 15,
        targetLabel: "saldo",
      },
    ];

    const oneShotValues = [];

    for (const definition of labelDefinitions) {
      let textItem: PdfTextItem;
      if (!definition.targetLabel) {
        textItem = findByText(definition.label, items);
      } else {
        const baseTextItem = findByText(definition.label, items);
        textItem = findByTextNearestTo(
          definition.targetLabel,
          baseTextItem,
          items,
        );
      }

      // get the cell right underneath
      let relatedTextItem = findTextItemRelatedToTextItemLabel(
        textItem,
        items,
        definition,
      );

      if (relatedTextItem.length !== 1) {
        throw new Error(
          `Could not find correct set of columns for ${definition}`,
        );
      }

      oneShotValues.push({
        label: definition,
        value: relatedTextItem[0].str,
      });
    }

    console.log(oneShotValues);
    return;

    const amountRegex = /\d{1,3}(?:\.\d{3})*,\d{2}/; // 1.234,56
    const dateRegex = /\d{2}\/\d{2}\/\d{4}/; // dd/MM/yyyy

    const columns = clusterColumns(rows);
    const headers = mapHeadersToColumns(rows, ["LORDO", "NETTO"], columns);

    // Find header row index
    const normalize = defaultNormalize;
    const headerRowIndex = rows.findIndex((row) => {
      const line = normalize(row.items.map((i) => i.str).join(" "));
      return line.includes("lordo") || line.includes("netto");
    });

    if (headerRowIndex === -1 || Object.keys(headers).length === 0) {
      throw new Error("Could not locate LORDO/NETTO headers via layout parser");
    }

    // Scan downward for first numeric cell in each header's column
    function findAmountBelow(columnKey: string): number | undefined {
      const colIdx = headers[normalize(columnKey)];
      if (colIdx === undefined) return undefined;
      for (
        let i = headerRowIndex + 1;
        i < Math.min(rows.length, headerRowIndex + 10);
        i++
      ) {
        const row = rows[i];
        // pick the item whose x is nearest to the target column center
        const centerX = columns[colIdx];
        let best: { str: string; dx: number } | null = null;
        for (const it of row.items) {
          const dx = Math.abs(it.x - centerX);
          if (!best || dx < best.dx) best = { str: it.str.trim(), dx };
        }
        if (best && amountRegex.test(best.str)) {
          return parseItalianNumber(best.str.match(amountRegex)![0]);
        }
      }
      return undefined;
    }

    const gross = findAmountBelow("LORDO");
    const net = findAmountBelow("NETTO");
    if (gross === undefined || net === undefined) {
      throw new Error("Could not find LORDO/NETTO amounts below headers");
    }

    // Birth/Hire dates and Full Name via label rows
    function findLabelValue(
      label: string,
      lookaheadRows = 3,
    ): string | undefined {
      const idx = rows.findIndex((row) => {
        const line = normalize(row.items.map((i) => i.str).join(" "));
        return line.includes(normalize(label));
      });
      if (idx === -1) return undefined;
      for (
        let i = idx;
        i <= Math.min(idx + lookaheadRows, rows.length - 1);
        i++
      ) {
        const row = rows[i];
        const date = row.items.map((i) => i.str).find((s) => dateRegex.test(s));
        if (date) return date.match(dateRegex)![0];
      }
      return undefined;
    }

    function findFullName(): string | undefined {
      const idx = rows.findIndex((row) => {
        const line = normalize(row.items.map((i) => i.str).join(" "));
        return line.includes(normalize("COGNOME NOME"));
      });
      if (idx === -1) return undefined;
      const candidates: string[] = [];
      for (let i = idx; i <= Math.min(idx + 2, rows.length - 1); i++) {
        for (const it of rows[i].items) {
          const s = it.str.trim();
          if (s.length >= 5) candidates.push(s);
        }
      }
      // pick the longest candidate, then try odd-content cleanup
      const picked = candidates.sort((a, b) => b.length - a.length)[0];
      if (!picked) return undefined;
      const cleaned = tryParseFullNameFromOddContent(picked);
      return cleaned;
    }

    const birthDate = findLabelValue("DATA DI NASCITA");
    const hireDate = findLabelValue("DATA ASSUNZIONE");
    const fullName = findFullName();

    if (!birthDate || !hireDate || !fullName) {
      // Don't fail hard: allow partial results
      // but keep a consistent shape with the classic parser
    }

    // Extract first page as standalone PDF to maintain parity with existing API
    const pageAsPdf = await pdfUtils.extractPageAsPdf(buffer, 0);
    const pageAsPdfBase64 = Buffer.from(pageAsPdf).toString("base64");

    return {
      gross,
      net,
      birthDate,
      hireDate,
      fullName,
      pageAsPdfBase64,
    };
  },
  async parseMultiPageSalaries(buffer: ArrayBufferLike) {
    const parsedPdf = await pdfUtils.loadPdfStructure(buffer);

    // all pages except the last one (up to last 4) are salaries
    const salaries = [];
    for (let i = 0; i < parsedPdf.Pages.length - 1; i++) {
      const pageWithAmounts = parsedPdf.Pages[i];
      if (!pageWithAmounts) {
        throw new Error(
          `Could not find page ${i} in the salary PDF or salary has no pages`,
        );
      }
      try {
        const salaryInfo = await readPayrollInfosFromfPage(pageWithAmounts);

        // Extract the individual page as PDF
        const pageAsPdf = await pdfUtils.extractPageAsPdf(buffer, i);
        const pageAsPdfBase64 = Buffer.from(pageAsPdf).toString("base64");

        salaries.push({
          ...salaryInfo,
          pageAsPdfBase64,
        });
      } catch (e) {
        console.error(`Error parsing salary on page ${i + 1}:`, e);
        // some LUL have salaries up to the last 4 pages, a.k.a. it's ok to get exceptions on the last 4 pages
        if (i < parsedPdf.Pages.length - 4) {
          throw e;
        }
      }
    }
    return salaries;
  },
  computeEmployeesMonthlyCost(
    employeePayrolls: { gross: number; fullName: string }[],
    totalBusinessCost: number,
  ) {
    // Step 1: Calculate total gross
    const L_tot = employeePayrolls.reduce((sum, emp) => sum + emp.gross, 0);
    // Step 2: Calculate total oneri (O_tot)
    const O_tot = totalBusinessCost - L_tot;
    // Step 3: For each employee, calculate their business cost
    return employeePayrolls.map((emp) => {
      const q_i = emp.gross / L_tot;
      const O_i = q_i * O_tot;
      const CA_i = emp.gross + O_i;
      return {
        ...emp,
        businessCost: CA_i,
        oneri: O_i,
        quota: q_i,
      };
    });
  },
};

const calculatePointDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const GROSS_AMOUNT_LABEL = encodeURI("LORDO");
const NET_AMOUNT_LABEL = encodeURI("NETTO");
const BIRTH_DATE_LABEL = encodeURI("DATA DI NASCITA");
const HIRE_DATE_LABEL = encodeURI("DATA ASSUNZIONE");
const YEARLY_WORKING_HOURS_LABEL = encodeURI("ORE LAVOR. ANNUALI");
const FULL_NAME_LABEL = encodeURI("COGNOME NOME");

const ITALIAN_AMOUNT_REGEX = /\d{1,3}(?:\.\d{3})*,\d{2}/;
const ITALIAN_DATE_REGEX = /\d{2}\/\d{2}\/\d{4}/;

const parseItalianNumber = (value: string): number => {
  const normalized = value
    .trim()
    .replace(/\./g, "") // Remove all thousands separators
    .replace(",", "."); // Convert decimal separator
  return parseFloat(normalized);
};

async function readPayrollInfosFromfPage(page: Page) {
  const { Texts: content } = page;

  let grossAmountLabelItem: Text | undefined = undefined;
  let netAmountLabelItem: Text | undefined = undefined;
  let birthDateLabelItem: Text | undefined = undefined;
  let hireDateLabelItem: Text | undefined = undefined;
  let yearlyWorkingHoursLabelItem: Text | undefined = undefined;
  let fullNameLabelItem: Text | undefined = undefined;

  for (const item of content) {
    for (const textRun of item.R) {
      if (textRun.T.includes(GROSS_AMOUNT_LABEL)) {
        grossAmountLabelItem = item;
      }

      if (textRun.T.includes(NET_AMOUNT_LABEL)) {
        netAmountLabelItem = item;
      }

      if (textRun.T.includes(BIRTH_DATE_LABEL)) {
        birthDateLabelItem = item;
      }

      if (textRun.T.includes(HIRE_DATE_LABEL)) {
        hireDateLabelItem = item;
      }

      if (textRun.T.includes(YEARLY_WORKING_HOURS_LABEL)) {
        yearlyWorkingHoursLabelItem = item;
      }
      if (textRun.T.includes(FULL_NAME_LABEL)) {
        fullNameLabelItem = item;
      }
    }
  }

  if (grossAmountLabelItem === undefined) {
    throw new Error(
      `Could not find "${GROSS_AMOUNT_LABEL}" label in the salary PDF`,
    );
  }

  if (netAmountLabelItem === undefined) {
    throw new Error(
      `Could not find "${NET_AMOUNT_LABEL}" label in the salary PDF`,
    );
  }

  if (birthDateLabelItem === undefined) {
    throw new Error(
      `Could not find "${BIRTH_DATE_LABEL}" label in the salary PDF`,
    );
  }

  if (hireDateLabelItem === undefined) {
    throw new Error(
      `Could not find "${HIRE_DATE_LABEL}" label in the salary PDF`,
    );
  }

  if (fullNameLabelItem === undefined) {
    throw new Error(
      `Could not find "${FULL_NAME_LABEL}" label in the salary PDF`,
    );
  }

  const parsedAmounts: {
    parsed: number;
    distanceFromGross: number;
    distanceFromNet: number;
    x: number;
    y: number;
  }[] = [];

  const parsedDates: {
    parsed: string;
    distanceFromBirthDate: number;
    distanceFromHireDate: number;
    x: number;
    y: number;
  }[] = [];

  const parsedStrings: {
    parsed: string;
    distanceFromFullName: number;
    x: number;
    y: number;
    width: number;
  }[] = [];

  for (const item of page.Texts) {
    const text = item.R[0]?.T;
    if (!text) {
      continue;
    }
    const rawContent = decodeURIComponent(text).trim();

    const amountMatch = rawContent.match(ITALIAN_AMOUNT_REGEX);
    if (amountMatch) {
      const parsed = parseItalianNumber(amountMatch[0]);
      if (!isNaN(parsed)) {
        parsedAmounts.push({
          parsed,
          distanceFromGross: calculatePointDistance(item, grossAmountLabelItem),
          distanceFromNet: calculatePointDistance(item, netAmountLabelItem),
          x: item.x,
          y: item.y,
        });
        continue;
      }
    }

    const dateMatch = rawContent.match(ITALIAN_DATE_REGEX);
    if (dateMatch) {
      const parsed = dateMatch[0];
      parsedDates.push({
        parsed,
        distanceFromBirthDate: calculatePointDistance(item, birthDateLabelItem),
        distanceFromHireDate: calculatePointDistance(item, hireDateLabelItem),
        x: item.x,
        y: item.y,
      });
    }

    // some payrolls have odd formatting, and the rawContent that contains the full name is inside a single rawContent block that contains
    // fiscal code, some spaces, a registration number, and then the full name at the end
    const possibleFullName = tryParseFullNameFromOddContent(rawContent);
    if (possibleFullName !== rawContent) {
      parsedStrings.push({
        parsed: possibleFullName,
        distanceFromFullName: calculatePointDistance(item, fullNameLabelItem),
        x: item.x,
        y: item.y,
        width: item.w,
      });
      continue;
    }

    // consider as string
    const parsed = rawContent;
    parsedStrings.push({
      parsed,
      distanceFromFullName: calculatePointDistance(item, fullNameLabelItem),
      x: item.x,
      y: item.y,
      width: item.w,
    });
  }

  if (!parsedAmounts.length) {
    throw new Error("Could not find any amount in the salary PDF");
  }

  if (!parsedDates.length) {
    throw new Error("Could not find any date in the salary PDF");
  }

  // get the nearest gross and net amount
  let sortedParsedAmounts = parsedAmounts
    .filter((amount) => amount.y > grossAmountLabelItem.y)
    .sort((a, b) => a.distanceFromGross - b.distanceFromGross);
  if (!sortedParsedAmounts.length) {
    // Fallback: ignore y filter and just take nearest to label
    sortedParsedAmounts = parsedAmounts.sort(
      (a, b) => a.distanceFromGross - b.distanceFromGross,
    );
  }
  const gross = sortedParsedAmounts[0].parsed;

  let sortedParsedAmountsNet = parsedAmounts
    .filter((amount) => amount.y > netAmountLabelItem.y)
    .sort((a, b) => a.distanceFromNet - b.distanceFromNet);
  if (!sortedParsedAmountsNet.length) {
    // Fallback: ignore y filter and just take nearest to label
    sortedParsedAmountsNet = parsedAmounts.sort(
      (a, b) => a.distanceFromNet - b.distanceFromNet,
    );
  }
  const net = sortedParsedAmountsNet[0].parsed;

  // get the nearest birthdate and hire date
  let sortedParsedDates = parsedDates
    .filter((date) => date.y > birthDateLabelItem.y)
    .sort((a, b) => a.distanceFromBirthDate - b.distanceFromBirthDate);
  if (!sortedParsedDates.length) {
    // Fallback without y filter
    sortedParsedDates = parsedDates.sort(
      (a, b) => a.distanceFromBirthDate - b.distanceFromBirthDate,
    );
  }
  const birthDate = sortedParsedDates[0].parsed;

  let sortedParsedDatesHire = parsedDates
    .filter((date) => date.y > hireDateLabelItem.y)
    .sort((a, b) => a.distanceFromHireDate - b.distanceFromHireDate);
  if (!sortedParsedDatesHire.length) {
    // Fallback without y filter
    sortedParsedDatesHire = parsedDates.sort(
      (a, b) => a.distanceFromHireDate - b.distanceFromHireDate,
    );
  }
  const hireDate = sortedParsedDatesHire[0].parsed;

  // sort by largest width and get the nearest and largest full name
  let sortedParsedStrings = parsedStrings
    .filter((str) => str.y > fullNameLabelItem.y)
    .sort((a, b) => b.width - a.width); // larger width first

  if (!sortedParsedStrings.length) {
    // Fallback: consider all strings, prefer those with a space (likely full names), then by width
    sortedParsedStrings = parsedStrings
      .filter((s) => /\s/.test(s.parsed))
      .sort((a, b) => b.width - a.width);
  }

  const possibleFullNames = sortedParsedStrings
    .slice(0, 5)
    .sort((a, b) => a.distanceFromFullName - b.distanceFromFullName);
  const fullName = possibleFullNames[0].parsed;

  return {
    gross,
    net,
    birthDate,
    hireDate,
    fullName,
  };
}

async function readTotalBusinessCostFromPage(page: Page) {
  const parsedAmounts: {
    parsed: number;
  }[] = [];
  for (const item of page.Texts) {
    const text = item.R[0]?.T;
    if (!text) {
      continue;
    }

    const rawContent = decodeURIComponent(text).trim();

    const amountMatch = rawContent.match(ITALIAN_AMOUNT_REGEX);
    if (amountMatch) {
      const parsed = parseItalianNumber(amountMatch[0]);
      if (!isNaN(parsed)) {
        parsedAmounts.push({
          parsed,
        });
        continue;
      }
    }
  }

  if (!parsedAmounts.length) {
    throw new Error("Could not find any amount in the salary PDF");
  }

  // return the largest amount as total business cost
  const sortedParsedAmounts = parsedAmounts.sort((a, b) => b.parsed - a.parsed);
  return sortedParsedAmounts[0].parsed;
}

function tryParseFullNameFromOddContent(rawContent: string) {
  if (rawContent.length < 20) {
    return rawContent;
  }
  // try to extract the full name as the longest substring after the fiscal code
  const fiscalCodeMatch = rawContent.match(
    /[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]/,
  );
  if (!fiscalCodeMatch) {
    return rawContent;
  }

  const fiscalCodeIndex = fiscalCodeMatch.index!;
  let possibleFullName = rawContent
    .substring(fiscalCodeIndex + fiscalCodeMatch[0].length)
    .trim();
  if (possibleFullName.length <= 0) {
    return rawContent;
  }
  // now remove the registration number if present at the start (e.g. " 12345 ")
  possibleFullName = possibleFullName.replace(/^\d+\s*/, "");

  return possibleFullName;
}

function findByText(text: string, items: PdfTextItem[]): PdfTextItem {
  for (const item of items) {
    if (item.str.toLocaleLowerCase() === text) {
      return item;
    }
  }

  throw new Error(`Could not find ${text} in the salary PDF`);
}

function findByTextNearestTo(
  text: string,
  item: PdfTextItem,
  items: PdfTextItem[],
  forceBelow: boolean = true,
) {
  const equalTextItems: PdfTextItem[] = [];
  for (const itemFromFullList of items) {
    if (
      itemFromFullList.str.toLocaleLowerCase() === text &&
      itemFromFullList.page === item.page
    ) {
      if (forceBelow && itemFromFullList.y <= item.y) {
        continue;
      }
      equalTextItems.push(itemFromFullList);
    }
  }

  // return the nearest textItem to item
  let nearestTextItem: PdfTextItem | undefined = undefined;
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (const equalTextItem of equalTextItems) {
    const dx = item.x - equalTextItem.x;
    const dy = item.y - equalTextItem.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < minDistance) {
      minDistance = distance;
      nearestTextItem = equalTextItem;
    }
  }

  if (nearestTextItem) {
    console.log(
      `nearest item to ${item.str}(${item.x}, ${item.y}) is ${nearestTextItem.str}(${nearestTextItem.x}, ${nearestTextItem.y})`,
    );
    return nearestTextItem;
  }

  throw new Error(`Could not find ${text} near ${item.str} in the salary PDF`);
}

function findTextItemRelatedToTextItemLabel(
  item: PdfTextItem,
  items: PdfTextItem[],
  labelDefinition: LabelDefinition,
) {
  const amountRegex = /\d{1,3}(?:\.\d{3})*,\d{2}/; // 1.234,56
  const dateRegex = /\d{2}\/\d{2}\/\d{4}/; // dd/MM/yyyy

  // fin out all items above
  const belowItems = items
    .filter((it) => it.page === item.page)
    .filter(
      (it) =>
        it.y > item.y && it.y < item.y + item.height + labelDefinition.gapY,
    )
    .filter(
      (it) =>
        it.x >= item.x - labelDefinition.negativeGapX &&
        it.x < item.x + item.width + labelDefinition.gapX,
    )
    .filter((it) => {
      const type = labelDefinition.type;
      if (type === "italian_number") {
        return amountRegex.test(it.str);
      }

      if (type === "italian_date") {
        return dateRegex.test(it.str);
      }

      if (type === "text") {
        return it.str;
      }

      throw new Error(`Unknown type ${type} for ${labelDefinition.label}`);
    });
  if (belowItems.length === 0) {
    throw new Error(
      `Could not find cell below item ${item.str} with definition ${JSON.stringify(labelDefinition)}`,
    );
  }

  return belowItems;
}
