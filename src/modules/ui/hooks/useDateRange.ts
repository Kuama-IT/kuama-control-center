import { endOfMonth, format, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const useDateRange = () => {
  const today = new Date();
  const firstDateRange = startOfMonth(today);
  const lastDateRange = endOfMonth(today);
  const initialRange = {
    from: firstDateRange,
    to: lastDateRange,
  };
  const [range, setRange] = useState<DateRange>(initialRange);
  const from = range?.from ? format(range.from, "dd-MM-yyyy") : "";
  const to = range?.to ? format(range.to, "dd-MM-yyyy") : "";

  return { range, setRange, from, to, today };
};
