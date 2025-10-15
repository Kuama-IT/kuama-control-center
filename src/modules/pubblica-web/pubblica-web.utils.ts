import { extractTextItems, PdfTextItem } from "@/modules/pdf/pdf-layout";
import { parse } from "date-fns/parse";
import { Page } from "pdf2json";
import { pdfUtils } from "../pdf/pdf.utils";
import { PubblicaWebEmployeeMonthlyCost } from "@/modules/pubblica-web/schemas/pubblica-web-employee-monthly-cost-read";

type LabelDefinition = {
    type: "text" | "italian_date" | "italian_number" | "number";
    label:
        | "dipendente"
        | "codice fiscale"
        | "cognome nome"
        | "data di nascita"
        | "data assunzione"
        | "retribuzione totale"
        | "ore lavorate"
        | "gg. lavorati"
        | "netto"
        | "permessi / ex-festivita'"
        | "ferie"
        | "r.o.l.";
    gapY: number;
    gapX: number;
    negativeGapX: number;
    targetLabel?: string;
};

type PayrollInfo = {
    cf: string;
    fullName: string;
    birthDate: Date;
    hireDate: Date;
    gross: number;
    net: number;
    workedDays: number;
    workedHours: number;
    permissionsHoursBalance: number;
    holidaysHoursBalance: number;
    rolHoursBalance: number;
    payrollRegistrationNumber: number;
    buffer: Buffer; // PDF of the single payslip page
};

const labelDefinitions: LabelDefinition[] = [
    {
        type: "text",
        label: "dipendente",
        gapY: 20,
        gapX: 10,
        negativeGapX: 0,
    },
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
        gapY: 20,
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
        negativeGapX: 10,
        targetLabel: "saldo",
    },
    {
        type: "italian_number",
        label: "ferie",
        gapY: 20,
        gapX: 10,
        negativeGapX: 10,
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
];

export const pubblicaWebUtils = {
    async parseSalaryMonthlyBalance(buffer: ArrayBufferLike) {
        const parsedPdf = await pdfUtils.loadPdfStructure(buffer);
        let totalBusinessCost = 0;

        for (const page of parsedPdf.Pages) {
            try {
                totalBusinessCost += await readTotalBusinessCostFromPage(page);
            } catch (e) {
                console.error(
                    "Error reading total business cost from page:",
                    e,
                );
            }
        }

        return {
            totalBusinessCost,
        };
    },

    async parseMultiPageSalaries(
        buffer: ArrayBufferLike,
    ): Promise<PayrollInfo[]> {
        const dst = new ArrayBuffer(buffer.byteLength);
        new Uint8Array(dst).set(new Uint8Array(buffer));
        const { numPages, items } = await extractTextItems(dst);

        const payrolls: PayrollInfo[] = [];
        let pageIndex = 1;
        while (pageIndex <= numPages) {
            try {
                const rawValues: { label: string; value: string }[] = [];
                const pageItems = items.filter((i) => i.page === pageIndex);

                for (const definition of labelDefinitions) {
                    let textItem: PdfTextItem;
                    if (!definition.targetLabel) {
                        textItem = findByText(definition.label, pageItems);
                    } else {
                        const baseTextItem = findByText(
                            definition.label,
                            pageItems,
                        );
                        textItem = findByTextNearestTo(
                            definition.targetLabel,
                            baseTextItem,
                            pageItems,
                        );
                    }

                    let relatedTextItem = findTextItemRelatedToTextItemLabel(
                        textItem,
                        pageItems,
                        definition,
                    );

                    if (relatedTextItem.length !== 1) {
                        throw new Error(
                            `Could not find correct set of columns for ${definition}`,
                        );
                    }

                    rawValues.push({
                        label: definition.label,
                        value: relatedTextItem[0].str,
                    });
                }

                const pageAsPdf = await pdfUtils.extractPageAsPdf(
                    buffer,
                    pageIndex - 1,
                );

                const dipendente =
                    rawValues.find((r) => r.label === "dipendente")?.value ??
                    "";
                const payrollRegistrationNumber = isNaN(parseInt(dipendente))
                    ? 0
                    : parseInt(dipendente);

                payrolls.push({
                    cf:
                        rawValues.find((r) => r.label === "codice fiscale")
                            ?.value ?? "",
                    fullName:
                        rawValues.find((r) => r.label === "cognome nome")
                            ?.value ?? "",
                    birthDate: parse(
                        rawValues.find((r) => r.label === "data di nascita")
                            ?.value ?? "",
                        "dd/MM/yyyy",
                        new Date(),
                    ),
                    hireDate: parse(
                        rawValues.find((r) => r.label === "data assunzione")
                            ?.value ?? "",
                        "dd/MM/yyyy",
                        new Date(),
                    ),
                    gross: parseItalianNumber(
                        rawValues.find((r) => r.label === "retribuzione totale")
                            ?.value ?? "0",
                    ),
                    net: parseItalianNumber(
                        rawValues.find((r) => r.label === "netto")?.value ??
                            "0",
                    ),
                    workedDays: parseItalianNumber(
                        rawValues.find((r) => r.label === "gg. lavorati")
                            ?.value ?? "0",
                    ),
                    workedHours: parseItalianNumber(
                        rawValues.find((r) => r.label === "ore lavorate")
                            ?.value ?? "0",
                    ),
                    permissionsHoursBalance: parseItalianNumber(
                        rawValues.find(
                            (r) => r.label === "permessi / ex-festivita'",
                        )?.value ?? "0",
                    ),
                    holidaysHoursBalance: parseItalianNumber(
                        rawValues.find((r) => r.label === "ferie")?.value ??
                            "0",
                    ),
                    rolHoursBalance: parseItalianNumber(
                        rawValues.find((r) => r.label === "r.o.l.")?.value ??
                            "0",
                    ),
                    payrollRegistrationNumber,
                    buffer: Buffer.from(pageAsPdf),
                });
            } catch (e) {
                // it's expected that some of the last pages may not be salaries
                console.error(`Error parsing salary on page ${pageIndex}:`);
            }
            pageIndex++;
        }
        return payrolls;
    },

    computeEmployeesMonthlyCost(
        employeePayrolls: { gross: number; fullName: string }[],
        totalBusinessCost: number,
    ): PubblicaWebEmployeeMonthlyCost[] {
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

const ITALIAN_AMOUNT_REGEX = /\d{1,3}(?:\.\d{3})*,\d{2}/;
const ITALIAN_DATE_REGEX = /\d{2}\/\d{2}\/\d{4}/;

const parseItalianNumber = (value: string): number => {
    const normalized = value
        .trim()
        .replace(/\./g, "") // Remove all thousands separators
        .replace(",", "."); // Convert decimal separator
    return parseFloat(normalized);
};

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
            }
        }
    }

    if (!parsedAmounts.length) {
        throw new Error("Could not find any amount in the salary PDF");
    }

    // return the largest amount as total business cost
    const sortedParsedAmounts = parsedAmounts.sort(
        (a, b) => b.parsed - a.parsed,
    );
    return sortedParsedAmounts[0].parsed;
}

function findByText(text: string, items: PdfTextItem[]): PdfTextItem {
    // ensure items are "vertically" sorted
    items.sort((a, b) => a.y - b.y);

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

    throw new Error(
        `Could not find ${text} near ${item.str} in the salary PDF`,
    );
}

function findTextItemRelatedToTextItemLabel(
    item: PdfTextItem,
    items: PdfTextItem[],
    labelDefinition: LabelDefinition,
) {
    // fin out all items above
    const belowItems = items
        .filter((it) => it.page === item.page)
        .filter(
            (it) =>
                it.y > item.y &&
                it.y < item.y + item.height + labelDefinition.gapY,
        )
        .filter(
            (it) =>
                it.x >= item.x - labelDefinition.negativeGapX &&
                it.x < item.x + item.width + labelDefinition.gapX,
        )
        .filter((it) => {
            const type = labelDefinition.type;
            if (type === "italian_number") {
                return ITALIAN_AMOUNT_REGEX.test(it.str);
            }

            if (type === "italian_date") {
                return ITALIAN_DATE_REGEX.test(it.str);
            }

            if (type === "text") {
                return it.str;
            }

            throw new Error(
                `Unknown type ${type} for ${labelDefinition.label}`,
            );
        });
    if (belowItems.length === 0) {
        console.log(
            `Could not find cell below item ${item.str} with definition ${JSON.stringify(labelDefinition)}`,
        );
        throw new Error(
            `Could not find cell below item ${item.str} with definition ${JSON.stringify(labelDefinition)}`,
        );
    }

    return belowItems;
}
