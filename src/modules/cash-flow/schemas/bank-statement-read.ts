export type BankStatementRead = {
    accountNumber: string;
    openingBalance: BalanceRead;
    closingBalance: BalanceRead;
    transactions: Transaction[];
};

export type BalanceRead = {
    date: Date;
    amount: number;
};

export type Transaction = {
    date: Date;
    description: string;
    amount: number;
    extendedDescription: string;
};

export type CellValue =
    | { column: string; row: number; rawValue: string; type: "string" }
    | { column: string; row: number; rawValue: number; type: "number" };
