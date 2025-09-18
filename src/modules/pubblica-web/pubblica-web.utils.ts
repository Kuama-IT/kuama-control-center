import { Page, type Text } from "pdf2json";
import { pdfUtils } from "../pdf/pdf.utils";

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
    if (!salaryPage || parsedPdf.Pages.length !== 1) {
      throw new Error(
        `Could not find any page in the salary PDF or salary has more than one page`
      );
    }
    return await readPayrollInfosFromfPage(salaryPage);
  },
  async parseMultiPageSalaries(buffer: ArrayBufferLike) {
    const parsedPdf = await pdfUtils.loadPdfStructure(buffer);

    // all pages except the last one (up to last 4) are salaries
    const salaries = [];
    for (let i = 0; i < parsedPdf.Pages.length - 1; i++) {
      const pageWithAmounts = parsedPdf.Pages[i];
      if (!pageWithAmounts) {
        throw new Error(
          `Could not find page ${i} in the salary PDF or salary has no pages`
        );
      }
      try {
        const salaryInfo = await readPayrollInfosFromfPage(pageWithAmounts);
        salaries.push(salaryInfo);
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
    totalBusinessCost: number
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
  point2: { x: number; y: number }
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
    .replace(".", "") // Remove thousands separator
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
      `Could not find "${GROSS_AMOUNT_LABEL}" label in the salary PDF`
    );
  }

  if (netAmountLabelItem === undefined) {
    throw new Error(
      `Could not find "${NET_AMOUNT_LABEL}" label in the salary PDF`
    );
  }

  if (birthDateLabelItem === undefined) {
    throw new Error(
      `Could not find "${BIRTH_DATE_LABEL}" label in the salary PDF`
    );
  }

  if (hireDateLabelItem === undefined) {
    throw new Error(
      `Could not find "${HIRE_DATE_LABEL}" label in the salary PDF`
    );
  }

  if (fullNameLabelItem === undefined) {
    throw new Error(
      `Could not find "${FULL_NAME_LABEL}" label in the salary PDF`
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
  const sortedParsedAmounts = parsedAmounts
    .filter((amount) => amount.y > grossAmountLabelItem.y)
    .sort((a, b) => a.distanceFromGross - b.distanceFromGross);
  const gross = sortedParsedAmounts[0].parsed;

  const sortedParsedAmountsNet = parsedAmounts
    .filter((amount) => amount.y > netAmountLabelItem.y)
    .sort((a, b) => a.distanceFromNet - b.distanceFromNet);

  const net = sortedParsedAmountsNet[0].parsed;

  // get the nearest birthdate and hire date
  const sortedParsedDates = parsedDates
    .filter((date) => date.y > birthDateLabelItem.y)
    .sort((a, b) => a.distanceFromBirthDate - b.distanceFromBirthDate);
  const birthDate = sortedParsedDates[0].parsed;

  const sortedParsedDatesHire = parsedDates
    .filter((date) => date.y > hireDateLabelItem.y)
    .sort((a, b) => a.distanceFromHireDate - b.distanceFromHireDate);
  const hireDate = sortedParsedDatesHire[0].parsed;

  // sort by largest width and get the nearest and largest full name
  const sortedParsedStrings = parsedStrings
    .filter((str) => str.y > fullNameLabelItem.y)
    .sort((a, b) => {
      return b.width - a.width; // larger width first
    });

  // between the largest top 5, take the nearest
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
    console.log("rawContent too short:", rawContent);
    return rawContent;
  }
  // try to extract the full name as the longest substring after the fiscal code
  const fiscalCodeMatch = rawContent.match(
    /[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]/
  );
  if (!fiscalCodeMatch) {
    console.log("No fiscal code found in:", rawContent);
    return rawContent;
  }

  const fiscalCodeIndex = fiscalCodeMatch.index!;
  let possibleFullName = rawContent
    .substring(fiscalCodeIndex + fiscalCodeMatch[0].length)
    .trim();
  if (possibleFullName.length <= 0) {
    console.log("No full name found in:", rawContent);
    return rawContent;
  }
  // now remove the registration number if present at the start (e.g. " 12345 ")
  possibleFullName = possibleFullName.replace(/^\d+\s*/, "");

  return possibleFullName;
}
