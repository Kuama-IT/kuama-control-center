import { useQuery } from "@tanstack/react-query";
import { type OrganizationSuggestionRead } from "@/modules/clients/schemas/organization-suggestion-read";

export const useClientOrganizationSuggestionsQuery = (id: number) => {
    return useQuery({
        queryKey: ["clients", id, "organization-link-suggestions"],
        queryFn: async () => {
            const res = await fetch(
                `/api/clients/${id}/organization-link-suggestions`,
            );

            const json = await res.json();

            return json as OrganizationSuggestionRead[];
        },
    });
};
