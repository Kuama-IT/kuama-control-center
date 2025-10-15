import {
    BalanceRead,
    CellValue,
    Transaction,
} from "./schemas/bank-statement-read";
import * as XLSX from "xlsx";

export const bankStatementUtils = {
    parseBancaIntesaXslx(bytes: Buffer): CellValue[][] {
        const workbook = XLSX.read(bytes, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const [firstCell, lastCell] = worksheet["!ref"]!.split(":");
        const firstCellLetter = firstCell.replace(/[0-9]/g, "");
        const firstCellNumber = parseInt(firstCell.replace(/[A-Z]/g, ""));
        const lastCellLetter = lastCell.replace(/[0-9]/g, "");
        const lastCellNumber = parseInt(lastCell.replace(/[A-Z]/g, ""));

        const numRows = lastCellNumber - firstCellNumber + 1;
        const rows: CellValue[][] = Array.from({ length: numRows }, () => []);

        for (let row = firstCellNumber; row <= lastCellNumber; row++) {
            for (
                let col = firstCellLetter.charCodeAt(0);
                col <= lastCellLetter.charCodeAt(0);
                col++
            ) {
                const cellAddress = String.fromCharCode(col) + row;
                const cell = worksheet[cellAddress];

                if (cell && cell.v) {
                    let cellValue: CellValue;
                    if (typeof cell.v === "string") {
                        cellValue = {
                            column: String.fromCharCode(col),
                            row: row,
                            rawValue: cell.v.toString().trim(),
                            type: "string",
                        };
                    } else if (typeof cell.v === "number") {
                        cellValue = {
                            column: String.fromCharCode(col),
                            row: row,
                            rawValue: cell.v,
                            type: "number",
                        };
                    } else {
                        throw new Error(
                            `Unknown cell type ${typeof cell.v} for cell ${cellAddress} value: ${JSON.stringify(cell.v)}`,
                        );
                    }
                    rows[row - firstCellNumber].push(cellValue);
                }
            }
        }

        return rows;
    },
    getAccountNumberFromBankStatementOrThrow(values: CellValue[][]): string {
        const accountNumberLabel = "Numero conto:";
        const accountNumberRow = values.find((row) =>
            row.some(
                (cell) =>
                    cell.type === "string" &&
                    cell.rawValue.includes(accountNumberLabel),
            ),
        );

        if (!accountNumberRow) {
            throw new Error("Account number not found");
        }

        const [, accountNumber] = accountNumberRow;
        if (accountNumber.type !== "string") {
            throw new Error("Account number is not a string");
        }

        return accountNumber.rawValue;
    },

    getOpeningBalanceFromBankStatementOrThrow(
        values: CellValue[][],
    ): BalanceRead {
        const openingBalanceLabel = "Saldo contabile iniziale al:";
        const openingBalanceRow = values.find((rows) =>
            rows.some(
                (r) =>
                    r.type === "string" &&
                    r.rawValue.includes(openingBalanceLabel),
            ),
        );

        if (openingBalanceRow === undefined) {
            throw new Error("Provided xslx has not expected format");
        }

        const [, rawOpeningBalanceDate, openingBalanceAmount] =
            openingBalanceRow;

        // rawOpeningBalanceDate is expected in format "01.07.2025"
        if (!rawOpeningBalanceDate || rawOpeningBalanceDate.type !== "string") {
            throw new Error("Provided xslx has not expected format");
        }
        const [day, month, year] = rawOpeningBalanceDate.rawValue.split(".");
        const openingBalanceDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
        );

        if (!openingBalanceAmount || openingBalanceAmount.type !== "number") {
            throw new Error("Provided xslx has not expected format");
        }
        return {
            date: openingBalanceDate,
            amount: openingBalanceAmount.rawValue,
        };
    },

    getClosingBalanceFromBankStatementOrThrow(
        values: CellValue[][],
    ): BalanceRead {
        const closingBalanceLabel = "Saldo contabile finale al:";
        const closingBalanceRow = values.find((rows) =>
            rows.some(
                (r) =>
                    r.type === "string" &&
                    r.rawValue.includes(closingBalanceLabel),
            ),
        );

        if (closingBalanceRow === undefined) {
            throw new Error("Provided xslx has not expected format");
        }

        const [, rawClosingBalanceDate, closingBalanceAmount] =
            closingBalanceRow;

        // rawClosingBalanceDate is expected in format "01.07.2025"
        if (!rawClosingBalanceDate || rawClosingBalanceDate.type !== "string") {
            throw new Error("Provided xslx has not expected format");
        }
        const [day, month, year] = rawClosingBalanceDate.rawValue.split(".");
        const closingBalanceDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
        );

        if (!closingBalanceAmount || closingBalanceAmount.type !== "number") {
            throw new Error("Provided xslx has not expected format");
        }
        return {
            date: closingBalanceDate,
            amount: closingBalanceAmount.rawValue,
        };
    },

    getFirstRowWithTransactionsOrThrow(values: CellValue[][]): number {
        const needleLabel = "Saldo contabile iniziale in Euro";
        const rowWithTransactions = values.findIndex((row) =>
            row.some(
                (cell) =>
                    cell.type === "string" &&
                    cell.rawValue.includes(needleLabel),
            ),
        );

        if (rowWithTransactions === -1) {
            throw new Error("No transactions found in provided xslx");
        }

        return rowWithTransactions + 1; // the next row is the first with transactions
    },

    getLastRowWithTransactionsOrThrow(values: CellValue[][]): number {
        const needleLabel = "Saldo contabile finale in Euro";
        const rowWithTransactions = values.findIndex((row) =>
            row.some(
                (cell) =>
                    cell.type === "string" &&
                    cell.rawValue.includes(needleLabel),
            ),
        );

        if (rowWithTransactions === -1) {
            throw new Error("No transactions found in provided xslx");
        }

        return rowWithTransactions - 1; // the previous row is the last with transactions
    },

    parseTransactionRowOrThrow(row: CellValue[]): Transaction {
        if (row.length < 4) {
            throw new Error("Transaction row has not expected format");
        }
        const [rawDate, _, description, amount, extendedDescription] = row;
        if (rawDate.type !== "number") {
            throw new Error("Transaction row has not expected format");
        }

        const dateObj = XLSX.SSF.parse_date_code(rawDate.rawValue);

        const date = new Date(dateObj.y, dateObj.m - 1, dateObj.d);

        if (description.type !== "string") {
            throw new Error("Transaction row has not expected format");
        }

        if (amount.type !== "number") {
            throw new Error("Transaction row has not expected format");
        }

        if (extendedDescription && extendedDescription.type !== "string") {
            throw new Error("Transaction row has not expected format");
        }

        return {
            date,
            description: description.rawValue,
            amount: amount.rawValue,
            extendedDescription: extendedDescription?.rawValue ?? "",
        };
    },
};
