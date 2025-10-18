import { type vats } from "@/drizzle/schema";
import { type ClientRead } from "@/modules/clients/schemas/client-read";
import { type OrganizationRead } from "@/modules/you-track/schemas/organization-read";

export type ClientReadExtended = ClientRead & {
    vats: (typeof vats.$inferSelect)[];
    organization: OrganizationRead;
};
