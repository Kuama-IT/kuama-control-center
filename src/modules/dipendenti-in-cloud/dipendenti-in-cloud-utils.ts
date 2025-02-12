import { DipendentiInCloudApi } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { EmployeeSalaryWithGrossHistory } from "@/modules/dipendenti-in-cloud/schemas/dipendenti-in-cloud-schemas";
import PDFParser, { type Output, Page, type Text } from "pdf2json";

const parseSalaryPdf = (attachment: { url: string }): Promise<Output> =>
  new Promise((resolve, reject) => {
    void fetch(attachment.url)
      .then((res) => res.arrayBuffer())
      .then((pdfBuffer) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData) =>
          reject(errData.parserError),
        );
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          resolve(pdfData);
        });
        pdfParser.parseBuffer(Buffer.from(pdfBuffer));
      });
  });

const calculatePointDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const GROSS_AMOUNT_LABEL = encodeURI("RETRIBUZIONE TOTALE");
const MAX_DISTANCE_THRESHOLD = 32; // this number only works for the combo "pdf contents" + "pdf2json", I just printed the distances to find a good threshold

const parseItalianNumber = (value: string): number => {
  const normalized = value
    .trim()
    .replace(".", "") // Remove thousands separator
    .replace(",", "."); // Convert decimal separator
  return parseFloat(normalized);
};

export const readGrossSalary = async (attachment: { url: string }) => {
  const parsedPdf = await parseSalaryPdf(attachment);
  let grossAmountLabelItem: Text | undefined = undefined;
  let pageWithGrossAmount: Page | undefined = undefined;
  for (const page of parsedPdf.Pages) {
    const { Texts: content } = page;
    for (const item of content) {
      for (const textRun of item.R) {
        if (textRun.T.includes(GROSS_AMOUNT_LABEL)) {
          grossAmountLabelItem = item;
          pageWithGrossAmount = page;
          break;
        }
      }
    }
  }

  if (grossAmountLabelItem === undefined || pageWithGrossAmount === undefined) {
    throw new Error(
      `Could not find "${GROSS_AMOUNT_LABEL}" label in the salary PDF`,
    );
  }

  const possibleGrossAmount: number[] = [];
  for (const item of pageWithGrossAmount.Texts) {
    if (
      (item.x === grossAmountLabelItem.x &&
        item.y === grossAmountLabelItem.y) || // do not consider the gross amount label item
      item.y < grossAmountLabelItem.y // do not consider any item that occurs above the gross amount label item
    ) {
      continue;
    }

    const distance = calculatePointDistance(item, grossAmountLabelItem);

    if (distance < MAX_DISTANCE_THRESHOLD && item.y > grossAmountLabelItem.y) {
      const text = item.R[0]?.T;
      if (!text) {
        continue;
      }
      // we're looking for a number under the label
      const grossSalaryItalianNumber = decodeURIComponent(text).trim();

      if (!grossSalaryItalianNumber) {
        continue;
      }
      const parsed = parseItalianNumber(grossSalaryItalianNumber);
      if (!isNaN(parsed) && parsed > 1000) {
        possibleGrossAmount.push(parsed);
        break;
      }
    }
  }

  if (possibleGrossAmount.length === 0) {
    throw new Error("Could not find gross amount in pdf");
  }

  return Math.max(...possibleGrossAmount);
};

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
      name: payroll.name,
      salaries: {},
    };

    for (const [year, salaries] of Object.entries(payroll.salaries)) {
      payrollWithGross.salaries[Number(year)] = [];
      for (const salary of salaries) {
        const gross = await readGrossSalary(salary);
        payrollWithGross.salaries[Number(year)].push({
          ...salary,
          gross,
        });
      }
    }
    payrollsWithGrossAmount.push(payrollWithGross);
  }
  return payrollsWithGrossAmount;
};
