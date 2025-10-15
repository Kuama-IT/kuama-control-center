export type CashFlowImportRead = {
    id: number;
    createdAt: Date;
    importedAt: Date | null;
    fileSizeInKB: string;
    fileName: string;
};
