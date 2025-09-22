export type CashFlowEntryRead = {
  id: number;
  date: Date;
  amount: number;
  description: string | null;
  extendedDescription: string | null;
  isIncome: boolean;
  categoryId: number;
};
