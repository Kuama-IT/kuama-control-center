import { cn } from "@/lib/utils";
import { Client } from "@fattureincloud/fattureincloud-ts-sdk";
import { on } from "events";

export const FattureInCloudClientCard = ({
  client,
  onClick,
  selected = false,
}: {
  selected?: boolean;
  client: Client;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg max-w-md",
        onClick && "cursor-pointer",
        selected ? "bg-blue-100 border border-blue-400" : "bg-white shadow"
      )}
      onClick={onClick}
    >
      <h2 className="font-bold text-lg mb-2">{client.name}</h2>
      <p className="text-sm">
        <span className="font-semibold">VAT Number:</span> {client.vat_number}
      </p>
    </div>
  );
};
