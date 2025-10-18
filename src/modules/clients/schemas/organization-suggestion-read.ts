import { type OrganizationRead } from "@/modules/you-track/schemas/organization-read";

export type OrganizationSuggestionRead = OrganizationRead & { score: number };
