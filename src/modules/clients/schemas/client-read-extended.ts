import { ClientRead } from "@/modules/clients/schemas/client-read";
import { vats } from "@/drizzle/schema";
import { OrganizationRead } from "@/modules/you-track/schemas/organization-read";

export type ClientReadExtended = ClientRead & {
    vats: Array<typeof vats.$inferSelect>;
    organization: OrganizationRead;
};
