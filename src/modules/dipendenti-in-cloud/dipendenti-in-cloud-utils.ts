import { DipendentiInCloudApi } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { EmployeeSalaryWithGrossHistory } from "@/modules/dipendenti-in-cloud/schemas/dipendenti-in-cloud-schemas";
import PDFParser, { type Output, Page, type Text } from "pdf2json";

export const parseSalaryPdf = (pdfBuffer: ArrayBufferLike): Promise<Output> =>
  new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError),
    );
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfData);
    });
    pdfParser.parseBuffer(Buffer.from(pdfBuffer));
  });

export const calculatePointDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const GROSS_AMOUNT_LABEL = encodeURI("LORDO");
export const NET_AMOUNT_LABEL = encodeURI("NETTO");
export const BIRTH_DATE_LABEL = encodeURI("DATA DI NASCITA");
export const HIRE_DATE_LABEL = encodeURI("DATA ASSUNZIONE");
export const YEARLY_WORKING_HOURS_LABEL = encodeURI("ORE LAVOR. ANNUALI");
export const FULL_NAME_LABEL = encodeURI("COGNOME NOME");

export const ITALIAN_AMOUNT_REGEX = /\d{1,3}(?:\.\d{3})*,\d{2}/;
export const ITALIAN_DATE_REGEX = /\d{2}\/\d{2}\/\d{4}/;

export const parseItalianNumber = (value: string): number => {
  const normalized = value
    .trim()
    .replace(".", "") // Remove thousands separator
    .replace(",", "."); // Convert decimal separator
  return parseFloat(normalized);
};

export const parseMultipleSalaries = async (buffer: ArrayBufferLike) => {
  const parsedPdf = await parseSalaryPdf(buffer);

  // all pages except the last one are salaries
  const salaries = [];
  for (let i = 0; i < parsedPdf.Pages.length - 1; i++) {
    const pageWithAmounts = parsedPdf.Pages[i];
    if (!pageWithAmounts) {
      throw new Error(
        `Could not find page ${i} in the salary PDF or salary has no pages`,
      );
    }
    try {
      const salaryInfo = await parsePageToPayroll(pageWithAmounts);
      salaries.push(salaryInfo);
    } catch (e) {
      console.error(`Error parsing salary on page ${i + 1}:`, e);
      // some LUL have salaries up to the last 4 pages, so don't throw
      if (i < parsedPdf.Pages.length - 4) {
        throw e;
      }
    }
  }
  return salaries;
};

// todo get from pdf also the "ORE LAVOR. ANNUALI". It's optional hence don't throw if not found
export const parseSalary = async (buffer: ArrayBufferLike) => {
  const parsedPdf = await parseSalaryPdf(buffer);

  const pageWithAmounts = parsedPdf.Pages[0];
  if (!pageWithAmounts || parsedPdf.Pages.length !== 1) {
    throw new Error(
      `Could not find any page in the salary PDF or salary has more than one page`,
    );
  }
  return await parsePageToPayroll(pageWithAmounts);
};

async function parsePageToPayroll(pageWithAmounts: Page) {
  const { Texts: content } = pageWithAmounts;

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

  for (const item of pageWithAmounts.Texts) {
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
      // const distanceDiff = a.distanceFromFullName - b.distanceFromFullName;
      // if (distanceDiff !== 0) {
      //   return distanceDiff;
      // }
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

// todo rename
export const getSalaryHistoryWithGrossAmounts = async (
  api: DipendentiInCloudApi,
  years: number[],
): Promise<EmployeeSalaryWithGrossHistory[]> => {
  if (!years.length) {
    throw new Error("At least one year must be provided");
  }
  const payrolls = await api.getPayrollsHistory(years);
  const payrollsWithGrossAmount = [];
  for (const payroll of payrolls) {
    const payrollWithGross: EmployeeSalaryWithGrossHistory = {
      employeeId: payroll.employeeId,
      employeeName: payroll.employeeName,
      salaries: {},
    };

    for (const [year, salaries] of Object.entries(payroll.salaries)) {
      payrollWithGross.salaries[Number(year)] = [];
      for (const salary of salaries) {
        const salaryFile = await api.downloadSalary(salary);
        const salaryInfo = await parseSalary(salaryFile);
        payrollWithGross.salaries[Number(year)].push({
          ...salary,
          ...salaryInfo,
        });
      }
    }
    payrollsWithGrossAmount.push(payrollWithGross);
  }
  return payrollsWithGrossAmount;
};
