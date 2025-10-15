"use server";
import { Client } from "@fattureincloud/fattureincloud-ts-sdk/src/models/client";
import { db } from "@/drizzle/drizzle-db";
import { clientsVats, vats } from "@/drizzle/schema";
import { handleServerErrors } from "@/utils/server-action-utils";
import { fattureInCloudClientSchema } from "@/modules/fatture-in-cloud/schemas/fatture-in-cloud-schemas";
import { firstOrThrow } from "@/utils/array-utils";

async function associateFattureInCloudClientAction({
    kClientId,
    fattureInCloudClient,
}: {
    kClientId: number;
    fattureInCloudClient: Client;
}) {
    const parsed = fattureInCloudClientSchema.parse(fattureInCloudClient);

    const data: typeof vats.$inferInsert = {
        vat: parsed.vat_number,
        companyName: parsed.name,
        fattureInCloudId: parsed.id.toString(),
    };
    const vatRecords = await db
        .insert(vats)
        .values(data)
        .onConflictDoUpdate({
            target: vats.vat,
            set: {
                companyName: parsed.name,
                fattureInCloudId: parsed.id.toString(),
            },
        })
        .returning({ vatId: vats.id });
    const { vatId } = firstOrThrow(vatRecords);
    const relation: typeof clientsVats.$inferInsert = {
        clientId: kClientId,
        vatId,
    };
    await db.insert(clientsVats).values(relation);
}

const handled = handleServerErrors(associateFattureInCloudClientAction);

export default handled;
