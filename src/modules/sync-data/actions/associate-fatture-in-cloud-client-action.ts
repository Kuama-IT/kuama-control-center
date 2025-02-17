"use server";
import { Client } from "@fattureincloud/fattureincloud-ts-sdk/src/models/client";
import { db } from "@/drizzle/drizzle-db";
import { kClientVats } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { fattureInCloudClientSchema } from "@/modules/fatture-in-cloud/schemas/fatture-in-cloud-schemas";

async function associateFattureInCloudClientAction({
  kClientId,
  fattureInCloudClient,
}: {
  kClientId: number;
  fattureInCloudClient: Client;
}) {
  const parsed = fattureInCloudClientSchema.parse(fattureInCloudClient);

  const data: typeof kClientVats.$inferInsert = {
    clientId: kClientId,
    vat: parsed.vat_number,
    companyName: parsed.name,
    fattureInCloudId: parsed.id.toString(),
  };
  await db
    .insert(kClientVats)
    .values(data)
    .onConflictDoUpdate({
      target: [kClientVats.fattureInCloudId],
      set: {
        vat: parsed.vat_number,
        companyName: parsed.name,
      },
    });
}

export default handleServerErrors(associateFattureInCloudClientAction);
