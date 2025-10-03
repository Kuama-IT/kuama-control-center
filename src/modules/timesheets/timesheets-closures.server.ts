import { parse } from "date-fns";
import { unstable_cache } from "next/cache";
import { closuresCacheTag } from "@/modules/timesheets/cache/cache-tags";
import { timesheetsClosuresDb } from "./timesheets-closures.db";

const listClosuresCached = unstable_cache(
  timesheetsClosuresDb.selectClosures,
  ["timesheets:closures"],
  {
    revalidate: 60,
    tags: [closuresCacheTag],
  },
);

async function listClosures() {
  const closuresFromDb = await listClosuresCached();
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
}

export type ClosuresList = Awaited<ReturnType<typeof listClosures>>;

export const timesheetsClosuresServer = {
  list: listClosures,
};
