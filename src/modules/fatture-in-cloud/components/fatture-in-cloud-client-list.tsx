import { Client } from "@fattureincloud/fattureincloud-ts-sdk";
import { FattureInCloudClientCard } from "./fatture-in-cloud-client-card";

export const FattureInCloudClientList = ({
  clients,
}: {
  clients: Client[];
}) => {
  return (
    <div>
      <h2>Client List</h2>
      <div>
        {clients.map((client) => (
          <FattureInCloudClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
};
