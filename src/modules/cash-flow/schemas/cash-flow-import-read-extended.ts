import { type CashFlowImportRead } from "./cash-flow-import-read";

export type CashFlowImportReadExtended = CashFlowImportRead & {
    fileBase64: string;
};
