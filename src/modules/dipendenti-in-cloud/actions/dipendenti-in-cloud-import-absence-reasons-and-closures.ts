"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { kAbsenceReasons, kClosures } from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";
import { revalidateTag } from "next/cache";
import { KClosuresCacheTag } from "@/modules/k-closures/k-closures-cache-tags";

const dipendentiInCloudImportAbsenceReasonsAndClosures = async () => {
  const absenceReasons = await dipendentiInCloudApiClient.getAbsenceReasons();
  const closures = await dipendentiInCloudApiClient.getClosures();
  await db.transaction(async (tx) => {
    await tx.delete(kAbsenceReasons);
    await tx.delete(kClosures);

    await tx.insert(kAbsenceReasons).values(absenceReasons);
    await tx.insert(kClosures).values(
      closures.map(({ day, month, year, disabled_reason }) => ({
        day,
        month,
        year,
        description: disabled_reason,
      })),
    );
  });

  revalidateTag(KClosuresCacheTag);

  return {
    message: `Imported ${absenceReasons.length} absence reasons and ${closures.length} closures`,
  };
};

const handled = handleServerErrors(
  dipendentiInCloudImportAbsenceReasonsAndClosures,
);

export default handled;
