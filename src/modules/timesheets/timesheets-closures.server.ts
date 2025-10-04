import { parse } from "date-fns";
import { timesheetsClosuresDb } from "./timesheets-closures.db";
import type { ClosuresList } from "./schemas";

export const timesheetsClosuresServer = {
  async list(): Promise<ClosuresList> {
    const closuresFromDb = await timesheetsClosuresDb.selectClosures();
    const currentYear = new Date().getFullYear();

    return closuresFromDb.map((closure) => {
      const { day, month, year = currentYear } = closure;
      const paddedDay = String(day).padStart(2, "0");
      const paddedMonth = String(month).padStart(2, "0");

      return {
        ...closure,
        date: parse(
          `${paddedDay}-${paddedMonth}-${year}`,
          "dd-MM-yyyy",
          new Date(),
        ),
      };
    });
  },
};
