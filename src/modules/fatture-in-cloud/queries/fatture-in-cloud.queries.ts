import { IssuedDocument } from "@fattureincloud/fattureincloud-ts-sdk";
import { useQuery } from "@tanstack/react-query";

export const useEmittedInvoicesQuery = ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) => {
  return useQuery({
    queryKey: ["emitted-invoices", from, to],
    queryFn: async () => {
      const response = await fetch(
        `/api/fatture-in-cloud/emitted-invoices?date_from=${from.toISOString()}&date_to=${to.toISOString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch emitted invoices");
      return response.json() as unknown as IssuedDocument[];
    },
  });
};
