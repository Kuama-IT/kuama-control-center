import {
  ListAbsenceDaysParams,
  timesheetsAbsenceDb,
} from "./timesheets-absence.db";
import type { AbsenceDaysList, AbsenceReasonList } from "./schemas";

export const timesheetsAbsenceServer = {
  async list(params: ListAbsenceDaysParams): Promise<AbsenceDaysList> {
    return timesheetsAbsenceDb.selectAbsenceDays(params);
  },

  async listReasons(): Promise<AbsenceReasonList> {
    const reasons = await timesheetsAbsenceDb.selectAbsenceReasons();

    return [
      ...reasons,
      {
        id: 0,
        name: "Per contratto",
        code: "--",
      },
    ];
  },
};
