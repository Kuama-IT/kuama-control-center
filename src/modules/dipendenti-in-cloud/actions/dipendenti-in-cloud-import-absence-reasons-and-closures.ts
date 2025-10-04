"use server";
import { handleServerErrors } from "@/utils/server-action-utils";
import { absenceReasons, closures } from "@/drizzle/schema";
import { db } from "@/drizzle/drizzle-db";
import { dipendentiInCloudApiClient } from "@/modules/dipendenti-in-cloud/dipendenti-in-cloud-api-client";

const dipendentiInCloudImportAbsenceReasonsAndClosures = async () => {
  const absenceReasonsData = await dipendentiInCloudApiClient.getAbsenceReasons();
  const closuresData = await dipendentiInCloudApiClient.getClosures();
  await db.transaction(async (tx) => {
    await tx.delete(absenceReasons);
    await tx.delete(closures);

    await tx.insert(absenceReasons).values(absenceReasonsData);
    await tx.insert(closures).values(
      closuresData.map(({ day, month, year, disabled_reason }) => ({
        day,
        month,
        year,
        description: disabled_reason,
      })),
    );
  });

  return {
    message: `Imported ${absenceReasonsData.length} absence reasons and ${closuresData.length} closures`,
  };
};

const handled = handleServerErrors(
  dipendentiInCloudImportAbsenceReasonsAndClosures,
);

export default handled;
