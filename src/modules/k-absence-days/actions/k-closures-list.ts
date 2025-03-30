"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { db } from "@/drizzle/drizzle-db";
import { kClosures } from "@/drizzle/schema";
import { parse } from "date-fns";

async function kClosuresList() {
  const closuresFromDb = await db.select().from(kClosures);
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

const managed = handleServerErrors(kClosuresList);
export default managed;

export type KClosuresList = Awaited<ReturnType<typeof kClosuresList>>;
