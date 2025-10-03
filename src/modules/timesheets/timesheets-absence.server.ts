import { unstable_cache } from "next/cache";
import {
  absenceDaysCacheTag,
  absenceReasonsCacheTag,
} from "@/modules/timesheets/cache/cache-tags";
import {
  ListAbsenceDaysParams,
  timesheetsAbsenceDb,
} from "./timesheets-absence.db";

const listAbsenceDaysCached = async (params: ListAbsenceDaysParams) => {
  return unstable_cache(
    timesheetsAbsenceDb.selectAbsenceDays,
    [
      "timesheets:absence-days",
      params.from.toISOString(),
      params.to.toISOString(),
    ],
    {
      revalidate: 60,
      tags: [absenceDaysCacheTag],
    },
  )(params);
};

const listAbsenceReasonsCached = unstable_cache(
  timesheetsAbsenceDb.selectAbsenceReasons,
  ["timesheets:absence-reasons"],
  {
    revalidate: 60,
    tags: [absenceReasonsCacheTag],
  },
);

async function listAbsenceDays(params: ListAbsenceDaysParams) {
  return listAbsenceDaysCached(params);
}

async function listAbsenceReasons() {
  const reasons = await listAbsenceReasonsCached();

  return [
    ...reasons,
    {
      id: 0,
      name: "Per contratto",
      code: "--",
    },
  ];
}

export type AbsenceDaysList = Awaited<ReturnType<typeof listAbsenceDays>>;
export type AbsenceReasonList = Awaited<ReturnType<typeof listAbsenceReasons>>;

export const timesheetsAbsenceServer = {
  list: listAbsenceDays,
  listReasons: listAbsenceReasons,
};
